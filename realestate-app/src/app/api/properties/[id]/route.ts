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
    // Check if property is assigned to any leases with new archive logic
    const existingLeases = await prisma.lease.findMany({
      where: { propertyId: id },
      select: { 
        id: true, 
        status: true,
        payments: { select: { id: true } }
      }
    })

    if (existingLeases.length > 0) {
      const activeLeases = existingLeases.filter(lease => lease.status === 'ACTIVE')
      const nonArchivedLeases = existingLeases.filter(lease => 
        lease.status !== 'ARCHIVED'
      )
      
      if (activeLeases.length > 0) {
        return NextResponse.json({
          error: `Cannot delete property. It has ${activeLeases.length} active lease(s). Please terminate the lease(s) first, then archive them.`,
          suggestion: "TERMINATE_LEASES_FIRST",
          activeLeaseIds: activeLeases.map(l => l.id)
        }, { status: 400 })
      } else if (nonArchivedLeases.length > 0) {
        const leasesWithPayments = nonArchivedLeases.filter(lease => 
          lease.payments && lease.payments.length > 0
        )
        
        if (leasesWithPayments.length > 0) {
          return NextResponse.json({
            error: `Cannot delete property. It has ${nonArchivedLeases.length} lease(s) that need to be archived first. ${leasesWithPayments.length} of them have payment history.`,
            suggestion: "ARCHIVE_LEASES_FIRST",
            nonArchivedLeaseIds: nonArchivedLeases.map(l => l.id),
            archiveEndpoint: "/api/rentals/leases/[id]/archive"
          }, { status: 400 })
        } else {
          return NextResponse.json({
            error: `Cannot delete property. It has ${nonArchivedLeases.length} lease(s) without payments. You can delete these leases first, or archive the property instead.`,
            suggestion: "DELETE_OR_ARCHIVE_LEASES",
            nonArchivedLeaseIds: nonArchivedLeases.map(l => l.id)
          }, { status: 400 })
        }
      }
      
      // All leases are archived - inform user but allow deletion
      const archivedCount = existingLeases.filter(l => l.status === 'ARCHIVED').length
      if (archivedCount > 0) {
        // Could add a confirmation step here, but for now allow deletion
        console.log(`Deleting property with ${archivedCount} archived leases`)
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