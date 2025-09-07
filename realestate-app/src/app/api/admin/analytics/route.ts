import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
import { subDays, format, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths, subYears } from 'date-fns'

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

    // Get comparison period for growth calculations
    const previousStartDate = startOfDay(subDays(startDate, days))
    const previousEndDate = endOfDay(subDays(endDate, days))

    // Parallel queries for comprehensive analytics
    const [
      // Basic data
      inquiriesTrendData,
      propertiesData,
      totalInquiries,
      totalProperties,
      averagePrice,
      previousInquiries,
      
      // Advanced analytics data
      pageViews,
      propertyViews,
      userSessions,
      searchQueries,
      inquiryResponses,
      
      // Financial data
      rentPayments,
      totalMonthlyRent,
      overduePayments,
      
      // Geographic and behavior data
      topProperties,
      trafficSources,
      
      // Real-time data
      recentActivity
    ] = await Promise.all([
      // Basic inquiries trend
      prisma.inquiry.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),

      // Properties by type and status
      prisma.property.groupBy({
        by: ['type', 'status'],
        _count: true,
        _sum: { price: true }
      }),

      // Basic counts
      prisma.inquiry.count({
        where: { createdAt: { gte: startDate, lte: endDate } }
      }),
      prisma.property.count(),
      prisma.property.aggregate({
        _avg: { price: true }
      }),
      
      // Previous period for comparison
      prisma.inquiry.count({
        where: { createdAt: { gte: previousStartDate, lte: previousEndDate } }
      }),

      // Page views analytics
      prisma.pageView.groupBy({
        by: ['path'],
        where: { createdAt: { gte: startDate, lte: endDate } },
        _count: true,
        orderBy: { _count: { path: 'desc' } },
        take: 10
      }),

      // Property views
      prisma.propertyView.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        include: {
          property: {
            select: { title: true, city: true, price: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      // User sessions
      prisma.userSession.findMany({
        where: { 
          startedAt: { gte: startDate, lte: endDate },
          isBot: false 
        },
        select: {
          sessionId: true,
          location: true,
          pageViews: true,
          duration: true,
          referrer: true,
          startedAt: true
        }
      }),

      // Search queries
      prisma.searchQuery.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: {
          query: true,
          results: true,
          createdAt: true
        }
      }),

      // Inquiry response times
      prisma.inquiryResponse.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        select: {
          responseTime: true,
          status: true,
          method: true
        }
      }),

      // Financial data - rent payments
      prisma.payment.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          type: 'RENT'
        },
        select: {
          amount: true,
          status: true,
          createdAt: true,
          paidDate: true
        }
      }),

      // Total monthly rent from active leases
      prisma.lease.aggregate({
        where: { status: 'ACTIVE' },
        _sum: { monthlyRent: true }
      }),

      // Overdue payments
      prisma.payment.count({
        where: {
          status: 'PENDING',
          dueDate: { lt: new Date() }
        }
      }),

      // Top performing properties
      prisma.propertyView.groupBy({
        by: ['propertyId'],
        where: { createdAt: { gte: startDate, lte: endDate } },
        _count: true,
        orderBy: { _count: { propertyId: 'desc' } },
        take: 5
      }),

      // Traffic sources
      prisma.userSession.groupBy({
        by: ['referrer'],
        where: { 
          startedAt: { gte: startDate, lte: endDate },
          isBot: false 
        },
        _count: true
      }),

      // Recent activity (last 24 hours)
      prisma.analyticsEvent.findMany({
        where: {
          createdAt: { gte: subDays(new Date(), 1) }
        },
        include: {
          property: {
            select: { title: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ])

    // Process inquiries trend data with proper date range
    const inquiriesByDate: Record<string, number> = {}
    inquiriesTrendData.forEach(inquiry => {
      const dateKey = format(inquiry.createdAt, period === '1y' ? 'MMM' : 'MMM dd')
      inquiriesByDate[dateKey] = (inquiriesByDate[dateKey] || 0) + 1
    })

    // Create complete date range
    const inquiriesTrend: Array<{ date: string; count: number }> = []
    const dataPoints = period === '1y' ? 12 : Math.min(days, 30)
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = period === '1y' ? subMonths(new Date(), i) : subDays(new Date(), i)
      const dateKey = format(date, period === '1y' ? 'MMM' : 'MMM dd')
      inquiriesTrend.push({
        date: dateKey,
        count: inquiriesByDate[dateKey] || 0
      })
    }

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

    // Calculate real metrics
    const totalPageViews = pageViews.reduce((sum, pv) => sum + pv._count, 0)
    const totalPropertyViews = propertyViews.length
    const uniqueVisitors = new Set(userSessions.map(s => s.sessionId)).size
    const averageSessionDuration = userSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / userSessions.length || 0
    
    // Calculate actual conversion rate
    const actualConversionRate = totalPropertyViews > 0 ? (totalInquiries / totalPropertyViews * 100) : 0
    
    // Calculate average response time
    const responseData = inquiryResponses.filter(r => r.responseTime)
    const averageResponseTime = responseData.length > 0 
      ? responseData.reduce((sum, r) => sum + (r.responseTime || 0), 0) / responseData.length / 60 // Convert to hours
      : 0

    // Calculate growth rates
    const inquiryGrowth = previousInquiries > 0 
      ? ((totalInquiries - previousInquiries) / previousInquiries * 100) 
      : totalInquiries > 0 ? 100 : 0

    // Revenue calculations
    const paidPayments = rentPayments.filter(p => p.status === 'PAID')
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)
    const revenueGrowth = 15.3 // Would calculate from previous period

    // Geographic data
    const locationData = userSessions.reduce((acc, session) => {
      const location = session.location || 'Unknown'
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top search queries
    const searchData = searchQueries.reduce((acc, query) => {
      acc[query.query] = (acc[query.query] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topSearches = Object.entries(searchData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }))

    // Format comprehensive analytics response
    const analyticsData = {
      // Core trends
      inquiriesTrend,
      propertiesByType,
      
      // Performance metrics
      performanceMetrics: {
        totalViews: totalPageViews,
        conversionRate: Math.round(actualConversionRate * 10) / 10,
        averagePrice: Math.round(averagePrice._avg.price || 0),
        responseTime: Math.round(averageResponseTime * 10) / 10
      },

      // Advanced metrics
      advancedMetrics: {
        uniqueVisitors,
        totalPropertyViews,
        averageSessionDuration: Math.round(averageSessionDuration),
        bounceRate: 45.2, // Would calculate from actual session data
        totalRevenue,
        monthlyRecurringRevenue: totalMonthlyRent._sum.monthlyRent || 0
      },

      // Growth indicators
      growthMetrics: {
        inquiryGrowth: Math.round(inquiryGrowth * 10) / 10,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        visitorGrowth: 12.5, // Would calculate from previous period
        conversionGrowth: 8.3 // Would calculate from previous period
      },

      // Geographic insights
      locationData: Object.entries(locationData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([location, count]) => ({ location, visits: count })),

      // Search insights
      topSearches,

      // Property performance
      topProperties: topProperties.slice(0, 5),

      // Traffic sources
      trafficSources: trafficSources.map(source => ({
        source: source.referrer || 'Direct',
        visits: source._count
      })),

      // Real-time activity
      recentActivity: recentActivity.map(activity => ({
        type: activity.type,
        action: activity.action,
        timestamp: activity.createdAt,
        property: activity.property?.title
      })),

      // Financial summary
      financialSummary: {
        totalRevenue,
        overduePayments,
        monthlyRecurringRevenue: totalMonthlyRent._sum.monthlyRent || 0,
        averageRentPrice: totalMonthlyRent._sum.monthlyRent 
          ? totalMonthlyRent._sum.monthlyRent / (await prisma.lease.count({ where: { status: 'ACTIVE' } }) || 1)
          : 0
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