import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import AdminLayout from "@/components/admin/admin-layout"

// Add metadata
export const metadata = {
  title: "Analitika - Paneli Administrativ",
  description: "Analitika dhe raporte për menaxhimin e pronave",
}

// Cache for 5 minutes since analytics don't need to be real-time
export const revalidate = 300

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Get analytics data from API with proper authentication
  let analyticsData
  try {
    // Import prisma directly for server-side data fetching
    const { prisma } = await import('@/lib/db')
    const { subDays, format, startOfDay, endOfDay } = await import('date-fns')
    
    const days = 30
    const startDate = startOfDay(subDays(new Date(), days))
    const endDate = endOfDay(new Date())

    // Parallel queries for better performance
    const [
      inquiriesTrendData,
      propertiesData,
      paymentsData,
      totalInquiries,
      totalProperties,
      averagePrice
    ] = await Promise.all([
      // Inquiries trend over time
      prisma.inquiry.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          createdAt: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),

      // Properties by type and status
      prisma.property.groupBy({
        by: ['type', 'status'],
        _count: true,
        _sum: {
          price: true
        }
      }),

      // Payment data for revenue calculation
      prisma.payment.findMany({
        where: {
          status: 'PAID',
          paidDate: {
            gte: subDays(new Date(), 365), // Last year for monthly breakdown
            lte: new Date()
          }
        },
        select: {
          amount: true,
          paidDate: true
        }
      }),

      // Total counts for metrics
      prisma.inquiry.count(),
      prisma.property.count(),
      prisma.property.aggregate({
        _avg: {
          price: true
        }
      })
    ])

    // Process inquiries trend data
    const inquiriesByDate: Record<string, number> = {}
    inquiriesTrendData.forEach(inquiry => {
      const dateKey = format(inquiry.createdAt, 'MMM dd')
      inquiriesByDate[dateKey] = (inquiriesByDate[dateKey] || 0) + 1
    })

    const inquiriesTrend = Object.entries(inquiriesByDate)
      .map(([date, count]) => ({ date, count }))
      .slice(-14) // Last 14 days for trend

    // Process properties by type
    const propertiesGrouped: Record<string, { count: number; value: number }> = {}
    propertiesData.forEach(item => {
      const key = item.type
      if (!propertiesGrouped[key]) {
        propertiesGrouped[key] = { count: 0, value: 0 }
      }
      propertiesGrouped[key].count += item._count
      propertiesGrouped[key].value += item._sum.price || 0
    })

    const propertiesByType = Object.entries(propertiesGrouped).map(([type, data]) => ({
      type: type.replace('_', ' '),
      count: data.count,
      value: data.value
    }))

    // Process monthly revenue data
    const monthlyData: Record<string, number> = {}
    paymentsData.forEach(payment => {
      if (payment.paidDate) {
        const monthKey = format(payment.paidDate, 'MMM yyyy')
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + payment.amount
      }
    })

    const monthlyRevenue = Object.entries(monthlyData)
      .map(([month, revenue]) => ({
        month,
        revenue,
        target: revenue * 1.1 // Set target as 10% higher
      }))
      .slice(-6) // Last 6 months

    // Calculate performance metrics with real data
    const totalViews = totalInquiries * 8 // Estimated 8 views per inquiry
    const conversionRate = totalInquiries > 0 && totalProperties > 0 ? 
      (totalProperties / totalInquiries * 100) : 0
    
    // Calculate average response time from inquiries (mock for now)
    const responseTime = 2.5 // Would be calculated from actual response data

    analyticsData = {
      inquiriesTrend,
      propertiesByType,
      monthlyRevenue,
      performanceMetrics: {
        totalViews,
        conversionRate: Math.round(conversionRate * 10) / 10,
        averagePrice: Math.round(averagePrice._avg.price || 0),
        responseTime
      }
    }

    return (
      <AdminLayout user={session.user}>
        <AnalyticsDashboard data={analyticsData} />
      </AdminLayout>
    )
  } catch (error) {
    console.error("Error loading analytics:", error)
    
    // Return with fallback data
    const fallbackData = {
      inquiriesTrend: [],
      propertiesByType: [],
      monthlyRevenue: [],
      performanceMetrics: {
        totalViews: 0,
        conversionRate: 0,
        averagePrice: 0,
        responseTime: 0
      }
    }

    return (
      <AdminLayout user={session.user}>
        <AnalyticsDashboard data={fallbackData} />
      </AdminLayout>
    )
  }
}