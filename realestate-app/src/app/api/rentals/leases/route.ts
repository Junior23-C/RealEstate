import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const leases = await prisma.lease.findMany({
      include: {
        property: {
          include: {
            images: {
              where: { isPrimary: true }
            }
          }
        },
        tenant: true,
        payments: {
          orderBy: { dueDate: "desc" },
          take: 5
        }
      },
      orderBy: { startDate: "desc" }
    })

    return NextResponse.json(leases)
  } catch (error) {
    console.error("Error fetching leases:", error)
    return NextResponse.json(
      { error: "Failed to fetch leases" },
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
    const {
      propertyId,
      tenantId,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      petDeposit,
      lateFee,
      rentDueDay,
      notes
    } = body

    // Create the lease
    const lease = await prisma.lease.create({
      data: {
        propertyId,
        tenantId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRent: parseFloat(monthlyRent),
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : null,
        petDeposit: petDeposit ? parseFloat(petDeposit) : null,
        lateFee: lateFee ? parseFloat(lateFee) : 50,
        rentDueDay: rentDueDay ? parseInt(rentDueDay) : 1,
        notes,
        status: "ACTIVE"
      },
      include: {
        property: true,
        tenant: true
      }
    })

    // Update property status to RENTED
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: "RENTED",
        rentedDate: new Date(startDate),
        rentEndDate: new Date(endDate),
        tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
        tenantEmail: lease.tenant.email,
        tenantPhone: lease.tenant.phone
      }
    })

    // Generate monthly payments for the lease duration
    const payments = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const currentDate = new Date(start.getFullYear(), start.getMonth(), rentDueDay || 1)
    
    // If the rent due day is before the start date, move to next month
    if (currentDate < start) {
      currentDate.setMonth(currentDate.getMonth() + 1)
    }
    
    while (currentDate <= end) {
      payments.push({
        leaseId: lease.id,
        amount: parseFloat(monthlyRent),
        dueDate: new Date(currentDate),
        status: "PENDING"
      })
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    // Create all payments
    if (payments.length > 0) {
      await prisma.payment.createMany({
        data: payments
      })
    }

    console.log(`Created lease with ${payments.length} payments`)

    return NextResponse.json({ 
      success: true, 
      lease,
      paymentsCreated: payments.length
    })
  } catch (error) {
    console.error("Error creating lease:", error)
    return NextResponse.json(
      { error: "Failed to create lease" },
      { status: 500 }
    )
  }
}