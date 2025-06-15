import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// Bulk delete inquiries
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse("Invalid request: ids array required", { status: 400 })
    }

    // Delete all inquiries with the given IDs
    const result = await prisma.inquiry.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      deleted: result.count 
    })
  } catch (error) {
    console.error("Error deleting inquiries:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// Bulk update inquiry status
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { ids, status } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse("Invalid request: ids array required", { status: 400 })
    }

    if (!status || !['PENDING', 'CONTACTED', 'CLOSED'].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    // Update all inquiries with the given IDs
    const result = await prisma.inquiry.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        status
      }
    })

    return NextResponse.json({ 
      success: true, 
      updated: result.count 
    })
  } catch (error) {
    console.error("Error updating inquiries:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}