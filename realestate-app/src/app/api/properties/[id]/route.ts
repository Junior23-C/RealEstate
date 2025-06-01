import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const body = await request.json()
    const { imageUrls, primaryImageIndex, ...rawData } = body

    // Filter to only include valid Property model fields
    const propertyData = {
      title: rawData.title,
      description: rawData.description,
      price: parseFloat(rawData.price),
      type: rawData.type,
      status: rawData.status,
      address: rawData.address,
      city: rawData.city,
      state: rawData.state,
      zipCode: rawData.zipCode,
      bedrooms: parseInt(rawData.bedrooms),
      bathrooms: parseFloat(rawData.bathrooms),
      squareFeet: parseInt(rawData.squareFeet),
      lotSize: rawData.lotSize ? parseFloat(rawData.lotSize) : null,
      yearBuilt: rawData.yearBuilt ? parseInt(rawData.yearBuilt) : null,
      features: rawData.features || null
    }

    // Update property and replace images
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        images: {
          deleteMany: {},
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
    console.error("Error updating property:", error)
    return NextResponse.json(
      { error: "Failed to update property" },
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
    await prisma.property.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    )
  }
}