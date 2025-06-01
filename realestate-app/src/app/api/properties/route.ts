import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { imageUrls, primaryImageIndex, ...propertyData } = body

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: imageUrls.map((url: string, index: number) => ({
            url,
            alt: `${propertyData.title} - Image ${index + 1}`,
            isPrimary: primaryImageIndex >= 0 ? index === primaryImageIndex : index === 0
          }))
        }
      }
    })

    return NextResponse.json({ success: true, property })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    )
  }
}