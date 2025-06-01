import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { RentalDashboard } from "./rental-dashboard"

export default async function AdminRentalsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Get rental statistics
  const [
    totalLeases,
    activeLeases,
    expiringSoon,
    overduePayments,
    rentedProperties,
    availableProperties,
    recentPayments,
    upcomingPayments
  ] = await Promise.all([
    // Total leases count
    prisma.lease.count(),
    
    // Active leases count
    prisma.lease.count({
      where: { status: "ACTIVE" }
    }),
    
    // Leases expiring in next 30 days
    prisma.lease.count({
      where: {
        status: "ACTIVE",
        endDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    
    // Overdue payments count
    prisma.payment.count({
      where: {
        status: "OVERDUE",
        dueDate: {
          lt: new Date()
        }
      }
    }),
    
    // Rented properties count
    prisma.property.count({
      where: { status: "RENTED" }
    }),
    
    // Available properties count
    prisma.property.count({
      where: { status: "FOR_RENT" }
    }),
    
    // Recent payments (last 10)
    prisma.payment.findMany({
      where: { status: "PAID" },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true
          }
        }
      },
      orderBy: { paidDate: "desc" },
      take: 10
    }),
    
    // Upcoming payments (next 30 days)
    prisma.payment.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true
          }
        }
      },
      orderBy: { dueDate: "asc" },
      take: 20
    })
  ])

  // Get active leases with detailed information
  const activeLeaseDetails = await prisma.lease.findMany({
    where: { status: "ACTIVE" },
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
        where: {
          dueDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          }
        },
        orderBy: { dueDate: "desc" },
        take: 1
      }
    },
    orderBy: { startDate: "desc" }
  })

  const stats = {
    totalLeases,
    activeLeases,
    expiringSoon,
    overduePayments,
    rentedProperties,
    availableProperties,
    totalMonthlyRent: activeLeaseDetails.reduce((sum, lease) => sum + lease.monthlyRent, 0)
  }

  return (
    <RentalDashboard 
      stats={stats}
      activeLeases={activeLeaseDetails}
      recentPayments={recentPayments}
      upcomingPayments={upcomingPayments}
    />
  )
}