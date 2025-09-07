import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function DELETE(
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

    // Find the document
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // For data URLs, no physical file to delete
    // In a cloud storage setup, you'd delete the file from S3/Cloudinary here

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId }
    })

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const body = await request.json()
    const { type, description } = body

    // Find the document
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!existingDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Update the document metadata
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        type: type || existingDocument.type,
        description: description !== undefined ? description : existingDocument.description,
        updatedAt: new Date()
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

    return NextResponse.json({
      success: true,
      document: updatedDocument,
      message: "Document updated successfully"
    })

  } catch (error) {
    console.error("Error updating document:", error)
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    )
  }
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
      where: { id: documentId },
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

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ document })

  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    )
  }
}