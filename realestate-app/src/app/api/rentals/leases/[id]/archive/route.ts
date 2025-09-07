import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

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
    const leaseId = resolvedParams.id

    // Check if lease exists
    const existingLease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: {
        payments: true,
        property: { select: { title: true } },
        tenant: { select: { firstName: true, lastName: true } }
      }
    })

    if (!existingLease) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 })
    }

    // Archive the lease
    const archivedLease = await prisma.lease.update({
      where: { id: leaseId },
      data: {
        status: 'ARCHIVED',
        updatedAt: new Date()
      },
      include: {
        property: { select: { title: true } },
        tenant: { select: { firstName: true, lastName: true } },
        payments: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Lease archived successfully. All payment history has been preserved.",
      lease: archivedLease,
      archivedData: {
        totalPayments: archivedLease.payments.length,
        tenant: `${archivedLease.tenant.firstName} ${archivedLease.tenant.lastName}`,
        property: archivedLease.property.title,
        archivedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error archiving lease:", error)
    return NextResponse.json(
      { error: "Failed to archive lease" },
      { status: 500 }
    )
  }
}