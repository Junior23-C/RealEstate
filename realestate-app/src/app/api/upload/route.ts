import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"

// Validate image content by checking magic numbers
function validateImageMagicNumbers(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false

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

  return false
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting for file uploads
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`upload:${clientId}`, RATE_LIMITS.UPLOAD)
    
    if (!rateLimitResult.success) {
      return NextResponse.json({
        error: "Upload limit exceeded. Please wait before uploading again.",
        resetTime: rateLimitResult.resetTime
      }, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': RATE_LIMITS.UPLOAD.requests.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file content by checking magic numbers
    const isValidImageContent = validateImageMagicNumbers(buffer, file.type)
    if (!isValidImageContent) {
      return NextResponse.json({ error: "File content does not match declared file type." }, { status: 400 })
    }

    // Create unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') // Sanitize filename
    const extension = originalName.split(".").pop()?.toLowerCase() || 'jpg'
    const filename = `property-${timestamp}-${randomString}.${extension}`
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "properties")
    await mkdir(uploadDir, { recursive: true })
    
    // Write file
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    // Return the URL
    const url = `/uploads/properties/${filename}`
    
    return NextResponse.json({ url, filename })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}