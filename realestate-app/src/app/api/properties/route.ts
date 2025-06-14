import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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