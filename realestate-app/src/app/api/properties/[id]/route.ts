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
    // Check if property is assigned to any leases
    const existingLeases = await prisma.lease.findMany({
      where: { propertyId: id },
      select: { id: true, status: true }
    })

    if (existingLeases.length > 0) {
      const activeLeases = existingLeases.filter(lease => lease.status === 'ACTIVE')
      const anyLeases = existingLeases.length
      
      if (activeLeases.length > 0) {
        return NextResponse.json({
          error: `Cannot delete property. It has ${activeLeases.length} active lease(s). Please terminate the lease(s) first.`
        }, { status: 400 })
      } else if (anyLeases > 0) {
        return NextResponse.json({
          error: `Cannot delete property. It has ${anyLeases} lease(s) assigned. Please remove the lease(s) first.`
        }, { status: 400 })
      }
    }

    // Check if property has any inquiries
    const existingInquiries = await prisma.inquiry.findMany({
      where: { propertyId: id },
      select: { id: true }
    })

    if (existingInquiries.length > 0) {
      return NextResponse.json({
        error: `Cannot delete property. It has ${existingInquiries.length} inquiry/inquiries. Please remove the inquiries first or consider archiving the property instead.`
      }, { status: 400 })
    }

    // Delete the property (this will also cascade delete images)
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