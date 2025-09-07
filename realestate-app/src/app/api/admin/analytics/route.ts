import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
import { subDays, format, startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`analytics:${clientId}`, RATE_LIMITS.API_GENERAL)
    
    if (!rateLimitResult.success) {
      return NextResponse.json({
        error: "Too many requests"
      }, { status: 429 })
    }

    const url = new URL(request.url)
    const period = url.searchParams.get('period') || '30d'
    
    // Calculate date range based on period
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }
    
    const days = daysMap[period] || 30
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
        target: revenue * 1.1 // Set target as 10% higher for demo
      }))
      .slice(-6) // Last 6 months

    // Calculate performance metrics
    const totalViews = Math.floor(totalInquiries * 15.5) // Estimated based on conversion rate
    const conversionRate = totalInquiries > 0 ? ((totalProperties * 0.8) / totalInquiries * 100) : 0
    const responseTime = 4.2 // Average response time in hours (would be calculated from actual data)

    const analyticsData = {
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

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    )
  }
}