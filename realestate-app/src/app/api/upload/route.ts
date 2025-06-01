import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
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

    // Create unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
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