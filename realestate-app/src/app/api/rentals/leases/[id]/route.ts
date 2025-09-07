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

    const body = await request.json()
    const {
      propertyId,
      tenantId,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      status,
      terms
    } = body

    // Check if this is just a status update
    const isStatusUpdate = status && Object.keys(body).length === 1

    // If not just a status update, validate all required fields
    if (!isStatusUpdate && (!propertyId || !tenantId || !startDate || !endDate || monthlyRent === undefined || securityDeposit === undefined)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if lease exists
    const existingLease = await prisma.lease.findUnique({
      where: { id: leaseId }
    })

    if (!existingLease) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 })
    }

    // Prepare update data
    let updateData: any = {
      updatedAt: new Date()
    }

    if (isStatusUpdate) {
      // Only update status
      updateData.status = status
    } else {
      // Validate property exists
      const property = await prisma.property.findUnique({
        where: { id: propertyId }
      })

      if (!property) {
        return NextResponse.json({ error: "Property not found" }, { status: 404 })
      }

      // Validate tenant exists
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId }
      })

      if (!tenant) {
        return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
      }

      // Validate dates
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (start >= end) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        )
      }

      // Full update
      updateData = {
        propertyId,
        tenantId,
        startDate: start,
        endDate: end,
        monthlyRent: parseFloat(monthlyRent),
        securityDeposit: parseFloat(securityDeposit),
        status: status || 'PENDING',
        terms: terms || null,
        updatedAt: new Date()
      }
    }

    // Update the lease
    const updatedLease = await prisma.lease.update({
      where: { id: leaseId },
      data: updateData,
      include: {
        property: true,
        tenant: true
      }
    })

    return NextResponse.json({
      success: true,
      lease: updatedLease
    })

  } catch (error) {
    console.error("Error updating lease:", error)
    return NextResponse.json(
      { error: "Failed to update lease" },
      { status: 500 }
    )
  }
}

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
    const leaseId = resolvedParams.id

    // Check if lease exists
    const existingLease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: {
        payments: true
      }
    })

    if (!existingLease) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 })
    }

    // Check if lease has payments - if so, don't allow deletion
    if (existingLease.payments.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete lease with existing payments. Consider terminating it instead." },
        { status: 400 }
      )
    }

    // Delete the lease
    await prisma.lease.delete({
      where: { id: leaseId }
    })

    return NextResponse.json({
      success: true,
      message: "Lease deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting lease:", error)
    return NextResponse.json(
      { error: "Failed to delete lease" },
      { status: 500 }
    )
  }
}