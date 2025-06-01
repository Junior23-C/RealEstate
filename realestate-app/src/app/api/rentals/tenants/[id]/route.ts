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
      ssn,
      emergencyContact,
      emergencyPhone,
      employer,
      monthlyIncome,
      notes
    } = body

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        ssn,
        emergencyContact,
        emergencyPhone,
        employer,
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        notes
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
    // Check if tenant has active leases
    const activeLeases = await prisma.lease.findMany({
      where: {
        tenantId: id,
        status: "ACTIVE"
      }
    })

    if (activeLeases.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete tenant with active leases" },
        { status: 400 }
      )
    }

    await prisma.tenant.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tenant:", error)
    return NextResponse.json(
      { error: "Failed to delete tenant" },
      { status: 500 }
    )
  }
}