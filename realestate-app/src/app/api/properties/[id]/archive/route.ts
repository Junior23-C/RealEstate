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
    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: {
        leases: {
          select: { id: true, status: true, tenant: { select: { firstName: true, lastName: true } } }
        },
        inquiries: { select: { id: true } },
        images: { select: { id: true, url: true } }
      }
    })

    if (!existingProperty) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Archive the property
    const archivedProperty = await prisma.property.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        updatedAt: new Date()
      },
      include: {
        leases: {
          select: { 
            id: true, 
            status: true, 
            tenant: { select: { firstName: true, lastName: true } },
            payments: { select: { id: true } }
          }
        },
        inquiries: { select: { id: true } }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Property archived successfully. All related data has been preserved.",
      property: {
        id: archivedProperty.id,
        title: archivedProperty.title,
        address: archivedProperty.address,
        status: archivedProperty.status
      },
      archivedData: {
        totalLeases: archivedProperty.leases.length,
        archivedLeases: archivedProperty.leases.filter(l => l.status === 'ARCHIVED').length,
        activeLeases: archivedProperty.leases.filter(l => l.status === 'ACTIVE').length,
        totalInquiries: archivedProperty.inquiries.length,
        totalPayments: archivedProperty.leases.reduce((sum, lease) => 
          sum + ((lease as { payments?: unknown[] }).payments?.length || 0), 0
        ),
        archivedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error archiving property:", error)
    return NextResponse.json(
      { error: "Failed to archive property" },
      { status: 500 }
    )
  }
}