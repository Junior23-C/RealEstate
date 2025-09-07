import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { AuditTrail } from "@/lib/audit-trail"

// Validate document content by checking magic numbers
function validateDocumentContent(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false

  // PDF: %PDF
  if (mimeType === "application/pdf") {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46
  }

  // PNG: 89 50 4E 47
  if (mimeType === "image/png") {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47
  }

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF
  }

  // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF...WEBP)
  if (mimeType === "image/webp") {
    if (buffer.length < 12) return false
    return buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
           buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  }

  // DOC: D0 CF 11 E0 A1 B1 1A E1
  if (mimeType === "application/msword") {
    if (buffer.length < 8) return false
    return buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0 &&
           buffer[4] === 0xA1 && buffer[5] === 0xB1 && buffer[6] === 0x1A && buffer[7] === 0xE1
  }

  // DOCX/XLSX: 50 4B (ZIP signature)
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return buffer[0] === 0x50 && buffer[1] === 0x4B
  }

  // Plain text - basic validation (printable ASCII + common whitespace)
  if (mimeType === "text/plain") {
    for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
      const byte = buffer[i]
      if (byte < 9 || (byte > 13 && byte < 32) || byte > 126) {
        return false
      }
    }
    return true
  }

  // Excel: D0 CF for older format
  if (mimeType === "application/vnd.ms-excel") {
    return buffer[0] === 0xD0 && buffer[1] === 0xCF
  }

  return false
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const documentId = resolvedParams.id

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // If the URL is a data URL, extract the base64 content and serve it properly
    if (document.url.startsWith('data:')) {
      const [mimeType, base64Data] = document.url.split(',')
      
      if (!mimeType || !base64Data) {
        return NextResponse.json({ error: "Invalid document format" }, { status: 400 })
      }
      
      const mimeTypeClean = mimeType.replace('data:', '').replace(';base64', '')
      
      // Validate base64 format
      if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
        return NextResponse.json({ error: "Invalid document encoding" }, { status: 400 })
      }
      
      let buffer: Buffer
      try {
        buffer = Buffer.from(base64Data, 'base64')
      } catch {
        return NextResponse.json({ error: "Failed to decode document" }, { status: 400 })
      }
      
      // Validate content matches MIME type
      if (!validateDocumentContent(buffer, mimeTypeClean)) {
        return NextResponse.json({ error: "Document content validation failed" }, { status: 400 })
      }
      
      // Log document view
      await AuditTrail.logDocumentView(
        session.user.id,
        document.id,
        document.originalName,
        request
      )
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeTypeClean,
          'Content-Disposition': `inline; filename="${document.originalName}"`,
          'Content-Length': buffer.length.toString(),
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, no-cache',
        }
      })
    } else {
      // For regular URLs, redirect
      return NextResponse.redirect(document.url)
    }

  } catch (error) {
    console.error("Error viewing document:", error)
    return NextResponse.json(
      { error: "Failed to view document" },
      { status: 500 }
    )
  }
}