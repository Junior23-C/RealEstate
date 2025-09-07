import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DocumentType } from "@prisma/client"
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
import { AuditTrail } from "@/lib/audit-trail"

// Allowed document types
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Validate document content by checking magic numbers
function validateDocumentMagicNumbers(buffer: Buffer, mimeType: string): boolean {
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

  // DOCX: 50 4B (ZIP signature)
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return buffer[0] === 0x50 && buffer[1] === 0x4B
  }

  // Plain text - allow any content
  if (mimeType === "text/plain") {
    return true
  }

  // Excel files - same as DOC for older format, ZIP for newer
  if (mimeType === "application/vnd.ms-excel") {
    return buffer[0] === 0xD0 && buffer[1] === 0xCF
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return buffer[0] === 0x50 && buffer[1] === 0x4B
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = await rateLimit(`documents:${clientId}`, RATE_LIMITS.UPLOAD)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many upload attempts", 
          resetTime: rateLimitResult.resetTime 
        },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file: File | null = formData.get("file") as unknown as File
    const documentType: string | null = formData.get("type") as string
    const description: string | null = formData.get("description") as string
    const leaseId: string | null = formData.get("leaseId") as string
    const propertyId: string | null = formData.get("propertyId") as string
    const tenantId: string | null = formData.get("tenantId") as string

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    if (!documentType) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: `File type not allowed. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}` 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 })
    }

    // Validate at least one relation is provided
    if (!leaseId && !propertyId && !tenantId) {
      return NextResponse.json({ 
        error: "At least one of leaseId, propertyId, or tenantId must be provided" 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file content
    if (!validateDocumentMagicNumbers(buffer, file.type)) {
      return NextResponse.json({ 
        error: "Invalid file content. File content doesn't match the declared type." 
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = path.extname(file.name) || getExtensionFromMimeType(file.type)
    const filename = `${timestamp}_${randomString}${extension}`
    
    // For Vercel deployment, store file as base64 data URL
    // In a full production setup, you'd use cloud storage like S3/Cloudinary
    const base64Data = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64Data}`

    // Save document metadata to database
    let document
    try {
      document = await prisma.document.create({
        data: {
          filename,
          originalName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          url: dataUrl,
          type: documentType as DocumentType,
          description: description || null,
          leaseId: leaseId || null,
          propertyId: propertyId || null,
          tenantId: tenantId || null,
          uploadedBy: session.user.email || session.user.id
        },
        include: {
          lease: {
            select: {
              leaseNumber: true,
              property: { select: { title: true } },
              tenant: { select: { firstName: true, lastName: true } }
            }
          },
          property: { select: { title: true } },
          tenant: { select: { firstName: true, lastName: true } }
        }
      })
    } catch (dbError) {
      console.error("Database error creating document:", dbError)
      
      // If Document table doesn't exist, return a helpful error
      if (dbError instanceof Error && dbError.message.includes('does not exist')) {
        return NextResponse.json({
          error: "Document management system is not yet available. Database schema update in progress."
        }, { status: 503 })
      }
      
      // Re-throw other database errors
      throw dbError
    }

    // Log successful document upload
    await AuditTrail.logDocumentUpload(
      session.user.id,
      document.id,
      file.name,
      file.size,
      request
    )

    return NextResponse.json({
      success: true,
      document,
      message: "Document uploaded successfully"
    })

  } catch (error) {
    console.error("Document upload error:", error)
    
    // More detailed error for debugging
    let errorMessage = "Failed to upload document"
    if (error instanceof Error) {
      errorMessage = `Upload failed: ${error.message}`
      // Log the full error details
      console.error("Full error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const leaseId = searchParams.get('leaseId')
    const propertyId = searchParams.get('propertyId')
    const tenantId = searchParams.get('tenantId')
    const type = searchParams.get('type')

    const where: {
      leaseId?: string
      propertyId?: string
      tenantId?: string
      type?: DocumentType
    } = {}
    
    if (leaseId) where.leaseId = leaseId
    if (propertyId) where.propertyId = propertyId
    if (tenantId) where.tenantId = tenantId
    if (type) where.type = type as DocumentType

    const documents = await prisma.document.findMany({
      where,
      include: {
        lease: {
          select: {
            leaseNumber: true,
            property: { select: { title: true } },
            tenant: { select: { firstName: true, lastName: true } }
          }
        },
        property: { select: { title: true } },
        tenant: { select: { firstName: true, lastName: true } }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ documents })

  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    )
  }
}

function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: { [key: string]: string } = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
  }
  
  return mimeToExt[mimeType] || ''
}