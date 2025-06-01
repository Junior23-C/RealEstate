import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const { status } = await request.json()

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error("Error updating inquiry:", error)
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    await prisma.inquiry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting inquiry:", error)
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    )
  }
}