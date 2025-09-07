import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Test if Document table exists by trying to count records
    const count = await prisma.document.count()
    
    return NextResponse.json({
      exists: true,
      count,
      message: "Document table exists and is accessible"
    })
  } catch (error) {
    console.error("Document table test error:", error)
    
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json({
        exists: false,
        error: "Document table does not exist",
        message: "Database schema needs to be updated"
      }, { status: 503 })
    }
    
    return NextResponse.json({
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Document table test failed"
    }, { status: 500 })
  }
}