import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// This endpoint can be called by:
// 1. Vercel Cron Jobs (paid plans)
// 2. External cron services like cron-job.org (free)
// 3. GitHub Actions (free)
// 4. Any webhook scheduler

export async function GET(request: Request) {
  try {
    // Verify the request is from a trusted source
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🕐 Running payment reminder cron job...")

    // Get current date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check for overdue payments
    const overduePayments = await prisma.payment.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          lt: today
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
      console.log(`📅 Updated ${overduePayments.length} payments to LATE status`)
    }

    // Check for payments due in 3 days
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    threeDaysFromNow.setHours(23, 59, 59, 999)

    const upcomingPayments = await prisma.payment.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          gte: today,
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
    const notificationsCreated = []

    for (const payment of upcomingPayments) {
      const daysUntilDue = Math.ceil((payment.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      // Check if notification already exists for today
      const existingNotification = await prisma.notification.findFirst({
        where: {
          leaseId: payment.leaseId,
          type: "RENT_DUE",
          scheduledFor: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })

      if (!existingNotification) {
        const notification = await prisma.notification.create({
          data: {
            leaseId: payment.leaseId,
            type: "RENT_DUE",
            title: `Rent Due ${daysUntilDue === 0 ? 'Today' : `in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`}`,
            message: `Hello ${payment.lease.tenant.firstName},

This is a friendly reminder that your rent payment of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)} for ${payment.lease.property.title} is due on ${payment.dueDate.toLocaleDateString()}.

Property: ${payment.lease.property.title}
Address: ${payment.lease.property.address}, ${payment.lease.property.city}, ${payment.lease.property.state}
Amount Due: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}
Due Date: ${payment.dueDate.toLocaleDateString()}

Please ensure payment is made on time to avoid late fees.

Best regards,
Property Management Team`,
            scheduledFor: today,
            method: "EMAIL"
          }
        })
        notificationsCreated.push(notification)
      }
    }

    // Create notifications for overdue payments
    for (const payment of overduePayments) {
      const daysOverdue = Math.ceil((today.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Check if notification already exists for today
      const existingNotification = await prisma.notification.findFirst({
        where: {
          leaseId: payment.leaseId,
          type: "RENT_OVERDUE",
          scheduledFor: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })

      if (!existingNotification) {
        const notification = await prisma.notification.create({
          data: {
            leaseId: payment.leaseId,
            type: "RENT_OVERDUE",
            title: `URGENT: Rent Payment Overdue - ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}`,
            message: `Hello ${payment.lease.tenant.firstName},

Your rent payment for ${payment.lease.property.title} was due on ${payment.dueDate.toLocaleDateString()} and is now ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue.

Property: ${payment.lease.property.title}
Address: ${payment.lease.property.address}, ${payment.lease.property.city}, ${payment.lease.property.state}
Amount Due: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}
Original Due Date: ${payment.dueDate.toLocaleDateString()}
Days Overdue: ${daysOverdue}

IMMEDIATE ACTION REQUIRED: Please contact us immediately to arrange payment.

Late fees may apply as per your lease agreement.

Property Management Team
Phone: [Your Phone Number]
Email: [Your Email]`,
            scheduledFor: today,
            method: "EMAIL"
          }
        })
        notificationsCreated.push(notification)
      }
    }

    // Log results
    console.log(`✅ Payment reminder cron job completed:`)
    console.log(`   - ${overduePayments.length} overdue payments found`)
    console.log(`   - ${upcomingPayments.length} upcoming payments found`)
    console.log(`   - ${notificationsCreated.length} notifications created`)

    // Return summary
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        overduePayments: overduePayments.length,
        upcomingPayments: upcomingPayments.length,
        notificationsCreated: notificationsCreated.length
      },
      details: {
        overduePayments: overduePayments.map(p => ({
          tenant: `${p.lease.tenant.firstName} ${p.lease.tenant.lastName}`,
          property: p.lease.property.title,
          amount: p.amount,
          dueDate: p.dueDate,
          daysOverdue: Math.ceil((today.getTime() - p.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        })),
        upcomingPayments: upcomingPayments.map(p => ({
          tenant: `${p.lease.tenant.firstName} ${p.lease.tenant.lastName}`,
          property: p.lease.property.title,
          amount: p.amount,
          dueDate: p.dueDate,
          daysUntilDue: Math.ceil((p.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        }))
      }
    })

  } catch (error) {
    console.error("❌ Error in payment reminder cron job:", error)
    return NextResponse.json(
      { 
        error: "Cron job failed", 
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // Allow POST requests as well (some cron services prefer POST)
  return GET(request)
}