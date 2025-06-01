import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const leaseId = searchParams.get('leaseId')

  try {
    const where: Record<string, unknown> = {}
    
    if (status) {
      where.status = status
    }
    
    if (leaseId) {
      where.leaseId = leaseId
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        lease: {
          include: {
            property: true,
            tenant: true
          }
        }
      },
      orderBy: { dueDate: "desc" }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json(
      { error: "Failed to fetch payments" },
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
      leaseId,
      tenantId,
      amount,
      type = "RENT", // Default to RENT if not specified
      dueDate,
      paymentMethod,
      transactionId, // Replaces checkNumber
      lateFeePaid,
      notes
    } = body

    // Get tenant from lease if not provided
    let finalTenantId = tenantId
    if (!finalTenantId && leaseId) {
      const lease = await prisma.lease.findUnique({
        where: { id: leaseId },
        select: { tenantId: true }
      })
      if (lease) {
        finalTenantId = lease.tenantId
      }
    }

    if (!finalTenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      )
    }

    // Build notes to include late fee information if provided
    let finalNotes = notes || ""
    if (lateFeePaid && parseFloat(lateFeePaid) > 0) {
      finalNotes = finalNotes 
        ? `${finalNotes}. Late fee paid: $${lateFeePaid}`
        : `Late fee paid: $${lateFeePaid}`
    }

    const payment = await prisma.payment.create({
      data: {
        leaseId,
        tenantId: finalTenantId,
        amount: parseFloat(amount),
        type,
        dueDate: new Date(dueDate),
        paymentMethod,
        transactionId, // Using transactionId instead of checkNumber
        notes: finalNotes,
        status: "PENDING"
      },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true
          }
        },
        tenant: true
      }
    })

    return NextResponse.json({ success: true, payment })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    )
  }
}