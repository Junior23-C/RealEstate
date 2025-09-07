import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        leases: {
          include: {
            property: {
              include: {
                images: {
                  where: { isPrimary: true }
                }
              }
            },
            payments: {
              orderBy: { dueDate: "desc" }
            }
          },
          orderBy: { startDate: "desc" }
        }
      }
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return NextResponse.json(
      { error: "Failed to fetch tenant" },
      { status: 500 }
    )
  }
}

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
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      emergencyContact,
      emergencyPhone,
      employer,
      employerPhone,
      monthlyIncome,
      previousAddress,
      reasonForLeaving
    } = body

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        emergencyContact,
        emergencyContactPhone: emergencyPhone,
        employer,
        employerPhone,
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        previousAddress,
        reasonForLeaving
      }
    })

    return NextResponse.json({ success: true, tenant })
  } catch (error) {
    console.error("Error updating tenant:", error)
    return NextResponse.json(
      { error: "Failed to update tenant" },
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
    // Check tenant leases with archive logic
    const existingLeases = await prisma.lease.findMany({
      where: { tenantId: id },
      select: { 
        id: true, 
        status: true, 
        property: { select: { title: true } },
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
          error: `Cannot delete tenant with ${activeLeases.length} active lease(s). Please terminate the lease(s) first.`,
          suggestion: "TERMINATE_LEASES_FIRST",
          activeLeases: activeLeases.map(l => ({
            id: l.id,
            property: l.property?.title
          }))
        }, { status: 400 })
      }
      
      if (nonArchivedLeases.length > 0) {
        const leasesWithPayments = nonArchivedLeases.filter(lease => 
          lease.payments && lease.payments.length > 0
        )
        
        if (leasesWithPayments.length > 0) {
          return NextResponse.json({
            error: `Cannot delete tenant with ${nonArchivedLeases.length} lease(s). ${leasesWithPayments.length} have payment history and should be archived first.`,
            suggestion: "ARCHIVE_LEASES_FIRST",
            nonArchivedLeases: nonArchivedLeases.map(l => ({
              id: l.id,
              property: l.property?.title,
              hasPayments: (l.payments?.length || 0) > 0
            }))
          }, { status: 400 })
        } else {
          return NextResponse.json({
            error: `Cannot delete tenant with ${nonArchivedLeases.length} lease(s) without payments. You can delete these leases first.`,
            suggestion: "DELETE_LEASES_FIRST",
            nonArchivedLeases: nonArchivedLeases.map(l => ({
              id: l.id,
              property: l.property?.title
            }))
          }, { status: 400 })
        }
      }
      
      // All leases are archived - allow deletion with info
      const archivedCount = existingLeases.filter(l => l.status === 'ARCHIVED').length
      if (archivedCount > 0) {
        console.log(`Deleting tenant with ${archivedCount} archived leases - history preserved`)
      }
    }

    await prisma.tenant.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true,
      message: "Tenant deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting tenant:", error)
    return NextResponse.json(
      { error: "Failed to delete tenant" },
      { status: 500 }
    )
  }
}