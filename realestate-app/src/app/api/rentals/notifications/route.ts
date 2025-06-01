import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check for overdue payments and create notifications
    const overduePayments = await prisma.payment.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          lt: new Date()
        }
      },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true
          }
        }
      }
    })

    // Update overdue payments status
    if (overduePayments.length > 0) {
      await prisma.payment.updateMany({
        where: {
          id: {
            in: overduePayments.map(p => p.id)
          }
        },
        data: {
          status: "LATE"
        }
      })
    }

    // Check for upcoming rent due dates (3 days before)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    const upcomingPayments = await prisma.payment.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          gte: new Date(),
          lte: threeDaysFromNow
        }
      },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true
          }
        }
      }
    })

    // Create notifications for upcoming payments
    const notificationsToCreate = []

    for (const payment of upcomingPayments) {
      // Check if notification already exists
      const existingNotification = await prisma.notification.findFirst({
        where: {
          leaseId: payment.leaseId,
          type: "RENT_DUE",
          scheduledFor: {
            gte: new Date(),
            lte: threeDaysFromNow
          }
        }
      })

      if (!existingNotification) {
        const daysUntilDue = Math.ceil((payment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        
        notificationsToCreate.push({
          leaseId: payment.leaseId,
          type: "RENT_DUE",
          title: `Rent Due ${daysUntilDue === 0 ? 'Today' : `in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`}`,
          message: `Hello ${payment.lease.tenant.firstName},\n\nThis is a friendly reminder that your rent payment of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)} for ${payment.lease.property.title} is due on ${payment.dueDate.toLocaleDateString()}.\n\nPlease contact us if you have any questions.\n\nBest regards,\nProperty Management`,
          scheduledFor: new Date(),
          method: "EMAIL"
        })
      }
    }

    // Create overdue notifications
    for (const payment of overduePayments) {
      const existingOverdueNotification = await prisma.notification.findFirst({
        where: {
          leaseId: payment.leaseId,
          type: "RENT_OVERDUE",
          scheduledFor: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })

      if (!existingOverdueNotification) {
        const daysOverdue = Math.ceil((new Date().getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        
        notificationsToCreate.push({
          leaseId: payment.leaseId,
          type: "RENT_OVERDUE",
          title: `Rent Payment Overdue - ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}`,
          message: `Hello ${payment.lease.tenant.firstName},\n\nYour rent payment of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)} for ${payment.lease.property.title} was due on ${payment.dueDate.toLocaleDateString()} and is now ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue.\n\nPlease contact us immediately to arrange payment.\n\nLate fees may apply.\n\nBest regards,\nProperty Management`,
          scheduledFor: new Date(),
          method: "EMAIL"
        })
      }
    }

    if (notificationsToCreate.length > 0) {
      await prisma.notification.createMany({
        data: notificationsToCreate
      })
    }

    // Here you would integrate with an email service like:
    // - Resend (free tier)
    // - SendGrid (free tier)
    // - Nodemailer with Gmail
    // - AWS SES (very cheap)

    // For now, we'll just log the notifications
    console.log(`Created ${notificationsToCreate.length} notifications`)
    console.log(`Found ${overduePayments.length} overdue payments`)
    console.log(`Found ${upcomingPayments.length} upcoming payments`)

    return NextResponse.json({
      success: true,
      notificationsCreated: notificationsToCreate.length,
      overduePayments: overduePayments.length,
      upcomingPayments: upcomingPayments.length
    })
  } catch (error) {
    console.error("Error processing notifications:", error)
    return NextResponse.json(
      { error: "Failed to process notifications" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const notifications = await prisma.notification.findMany({
      include: {
        lease: {
          include: {
            property: true,
            tenant: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}