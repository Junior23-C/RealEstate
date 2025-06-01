import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(
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
      status,
      paidDate,
      paymentMethod,
      transactionId, // Replaces checkNumber
      lateFeePaid,
      notes,
      amount,
      type
    } = body

    const updateData: Record<string, unknown> = {}
    
    if (status) updateData.status = status
    if (paidDate) updateData.paidDate = new Date(paidDate)
    if (paymentMethod) updateData.paymentMethod = paymentMethod
    if (transactionId !== undefined) updateData.transactionId = transactionId
    if (amount !== undefined) updateData.amount = parseFloat(amount)
    if (type) updateData.type = type
    
    // Handle late fee information in notes
    let finalNotes = notes
    if (lateFeePaid !== undefined && parseFloat(lateFeePaid) > 0) {
      finalNotes = notes 
        ? `${notes}. Late fee paid: $${lateFeePaid}`
        : `Late fee paid: $${lateFeePaid}`
    }
    if (finalNotes !== undefined) updateData.notes = finalNotes

    // If marking as paid and no paidDate provided, use current date
    if (status === 'PAID' && !paidDate) {
      updateData.paidDate = new Date()
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        lease: {
          include: {
            property: true,
            tenant: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, payment })
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json(
      { error: "Failed to update payment" },
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
    await prisma.payment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment:", error)
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    )
  }
}