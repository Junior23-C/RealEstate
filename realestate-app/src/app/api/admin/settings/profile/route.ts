import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, email } = body

    // Check if email is being changed and if it's already taken
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        name,
        email
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}