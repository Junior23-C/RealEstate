import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
import { subDays, format, startOfDay, endOfDay, subMonths } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`analytics_export:${clientId}`, {
      windowMs: 60 * 1000, // 1 minute
      maxAttempts: 5 // 5 exports per minute
    })
    
    if (!rateLimitResult.success) {
      return NextResponse.json({
        error: "Too many export requests"
      }, { status: 429 })
    }

    const url = new URL(request.url)
    const exportFormat = url.searchParams.get('format') || 'csv'
    const period = url.searchParams.get('period') || '30d'

    // Calculate date range
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }
    
    const days = daysMap[period] || 30
    const startDate = startOfDay(subDays(new Date(), days))
    const endDate = endOfDay(new Date())

    // Fetch comprehensive analytics data for export
    const [
      inquiries,
      properties,
      pageViews,
      propertyViews,
      userSessions,
      searchQueries,
      payments,
      leases
    ] = await Promise.all([
      prisma.inquiry.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          status: true,
          property: {
            select: { title: true, city: true, price: true }
          }
        }
      }),
      
      prisma.property.findMany({
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          price: true,
          city: true,
          createdAt: true,
          _count: {
            select: {
              inquiries: true,
              views: true
            }
          }
        }
      }),

      prisma.pageView.groupBy({
        by: ['path'],
        where: { createdAt: { gte: startDate, lte: endDate } },
        _count: true,
        orderBy: { _count: { path: 'desc' } }
      }),

      prisma.propertyView.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: {
          id: true,
          propertyId: true,
          sessionId: true,
          duration: true,
          source: true,
          location: true,
          createdAt: true
        }
      }),

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

      prisma.searchQuery.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: {
          query: true,
          results: true,
          location: true,
          createdAt: true
        }
      }),

      prisma.payment.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: {
          amount: true,
          status: true,
          type: true,
          createdAt: true,
          paidDate: true,
          lease: {
            select: {
              property: {
                select: { title: true, city: true }
              }
            }
          }
        }
      }),

      prisma.lease.findMany({
        where: { 
          OR: [
            { startDate: { gte: startDate, lte: endDate } },
            { status: 'ACTIVE' }
          ]
        },
        select: {
          id: true,
          monthlyRent: true,
          status: true,
          startDate: true,
          endDate: true,
          property: {
            select: { title: true, city: true }
          },
          tenant: {
            select: { firstName: true, lastName: true }
          }
        }
      })
    ])

    if (exportFormat === 'csv') {
      return generateCSVExport({
        inquiries,
        properties,
        pageViews,
        propertyViews,
        userSessions,
        searchQueries,
        payments,
        leases,
        period
      })
    } else if (exportFormat === 'pdf') {
      return generatePDFExport({
        inquiries,
        properties,
        pageViews,
        propertyViews,
        userSessions,
        searchQueries,
        payments,
        leases,
        period
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })

  } catch (error) {
    console.error("Analytics export error:", error)
    return NextResponse.json(
      { error: "Failed to export analytics data" },
      { status: 500 }
    )
  }
}

function generateCSVExport(data: any) {
  // Generate comprehensive CSV with multiple sheets worth of data
  let csvContent = ""
  
  // Summary Section
  csvContent += "ANALYTICS SUMMARY\n"
  csvContent += `Export Date,${new Date().toISOString()}\n`
  csvContent += `Period,${data.period}\n`
  csvContent += `Total Inquiries,${data.inquiries.length}\n`
  csvContent += `Total Properties,${data.properties.length}\n`
  csvContent += `Total Sessions,${data.userSessions.length}\n`
  csvContent += `Total Revenue,€${data.payments.filter((p: any) => p.status === 'PAID').reduce((sum: number, p: any) => sum + p.amount, 0)}\n`
  csvContent += "\n"

  // Inquiries Section
  csvContent += "INQUIRIES\n"
  csvContent += "Date,Name,Email,Property,City,Price,Status\n"
  data.inquiries.forEach((inquiry: any) => {
    csvContent += `${format(new Date(inquiry.createdAt), 'yyyy-MM-dd')},${inquiry.name},${inquiry.email},${inquiry.property?.title || 'N/A'},${inquiry.property?.city || 'N/A'},€${inquiry.property?.price || 0},${inquiry.status}\n`
  })
  csvContent += "\n"

  // Properties Section
  csvContent += "PROPERTIES PERFORMANCE\n"
  csvContent += "Title,Type,Status,Price,City,Inquiries,Views,Created\n"
  data.properties.forEach((property: any) => {
    csvContent += `${property.title},${property.type},${property.status},€${property.price},${property.city},${property._count?.inquiries || 0},${property._count?.views || 0},${format(new Date(property.createdAt), 'yyyy-MM-dd')}\n`
  })
  csvContent += "\n"

  // Page Views Section
  csvContent += "PAGE VIEWS\n"
  csvContent += "Page,Views\n"
  data.pageViews.forEach((page: any) => {
    csvContent += `${page.path},${page._count}\n`
  })
  csvContent += "\n"

  // Sessions Section
  csvContent += "USER SESSIONS\n"
  csvContent += "Session ID,Location,Page Views,Duration (seconds),Referrer,Started At\n"
  data.userSessions.forEach((session: any) => {
    csvContent += `${session.sessionId},${session.location || 'Unknown'},${session.pageViews},${session.duration || 0},${session.referrer || 'Direct'},${format(new Date(session.startedAt), 'yyyy-MM-dd HH:mm')}\n`
  })
  csvContent += "\n"

  // Search Queries Section
  csvContent += "SEARCH QUERIES\n"
  csvContent += "Query,Results,Location,Date\n"
  data.searchQueries.forEach((search: any) => {
    csvContent += `${search.query},${search.results},${search.location || 'Unknown'},${format(new Date(search.createdAt), 'yyyy-MM-dd HH:mm')}\n`
  })
  csvContent += "\n"

  // Financial Section
  csvContent += "PAYMENTS\n"
  csvContent += "Amount,Status,Type,Property,City,Date,Paid Date\n"
  data.payments.forEach((payment: any) => {
    csvContent += `€${payment.amount},${payment.status},${payment.type},${payment.lease?.property?.title || 'N/A'},${payment.lease?.property?.city || 'N/A'},${format(new Date(payment.createdAt), 'yyyy-MM-dd')},${payment.paidDate ? format(new Date(payment.paidDate), 'yyyy-MM-dd') : 'N/A'}\n`
  })

  const response = new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="analytics-${data.period}-${format(new Date(), 'yyyy-MM-dd')}.csv"`
    }
  })

  return response
}

function generatePDFExport(data: any) {
  // For PDF export, we'll create a detailed HTML report
  // In a real implementation, you'd use a library like puppeteer or jsPDF
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Analytics Report - ${data.period}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: white; border-radius: 5px; min-width: 120px; text-align: center; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #333; border-bottom: 2px solid #3B82F6; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .chart-placeholder { background: #f9f9f9; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Analytics Report</h1>
        <p>Period: ${data.period} | Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}</p>
      </div>

      <div class="summary">
        <h2>Summary</h2>
        <div class="metric">
          <h3>${data.inquiries.length}</h3>
          <p>Total Inquiries</p>
        </div>
        <div class="metric">
          <h3>${data.properties.length}</h3>
          <p>Properties</p>
        </div>
        <div class="metric">
          <h3>${data.userSessions.length}</h3>
          <p>Sessions</p>
        </div>
        <div class="metric">
          <h3>€${data.payments.filter((p: any) => p.status === 'PAID').reduce((sum: number, p: any) => sum + p.amount, 0).toLocaleString()}</h3>
          <p>Revenue</p>
        </div>
      </div>

      <div class="section">
        <h3>Top Properties by Inquiries</h3>
        <table>
          <tr><th>Property</th><th>Type</th><th>City</th><th>Price</th><th>Inquiries</th></tr>
          ${data.properties.slice(0, 10).map((prop: any) => `
            <tr>
              <td>${prop.title}</td>
              <td>${prop.type}</td>
              <td>${prop.city}</td>
              <td>€${prop.price.toLocaleString()}</td>
              <td>${prop._count?.inquiries || 0}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <div class="section">
        <h3>Recent Inquiries</h3>
        <table>
          <tr><th>Date</th><th>Name</th><th>Property</th><th>Status</th></tr>
          ${data.inquiries.slice(0, 15).map((inquiry: any) => `
            <tr>
              <td>${format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}</td>
              <td>${inquiry.name}</td>
              <td>${inquiry.property?.title || 'N/A'}</td>
              <td>${inquiry.status}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <div class="section">
        <h3>Top Search Queries</h3>
        <table>
          <tr><th>Query</th><th>Results</th><th>Location</th></tr>
          ${data.searchQueries.slice(0, 10).map((search: any) => `
            <tr>
              <td>${search.query}</td>
              <td>${search.results}</td>
              <td>${search.location || 'Unknown'}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <div class="section">
        <h3>Financial Overview</h3>
        <table>
          <tr><th>Date</th><th>Amount</th><th>Type</th><th>Status</th><th>Property</th></tr>
          ${data.payments.slice(0, 20).map((payment: any) => `
            <tr>
              <td>${format(new Date(payment.createdAt), 'MMM dd, yyyy')}</td>
              <td>€${payment.amount}</td>
              <td>${payment.type}</td>
              <td>${payment.status}</td>
              <td>${payment.lease?.property?.title || 'N/A'}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <footer style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
        <p>Generated by Real Estate Analytics System | ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</p>
      </footer>
    </body>
    </html>
  `

  // For now, return HTML. In production, convert to PDF using puppeteer
  const response = new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="analytics-report-${data.period}-${format(new Date(), 'yyyy-MM-dd')}.html"`
    }
  })

  return response
}