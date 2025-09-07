import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

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
      const mimeTypeClean = mimeType.replace('data:', '').replace(';base64', '')
      
      const buffer = Buffer.from(base64Data, 'base64')
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeTypeClean,
          'Content-Disposition': `inline; filename="${document.originalName}"`,
          'Content-Length': buffer.length.toString(),
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