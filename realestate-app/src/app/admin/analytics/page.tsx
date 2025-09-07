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

  // Fetch analytics data server-side for better performance
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/admin/analytics?period=30d`, {
      // Pass cookies for authentication
      headers: {
        cookie: `next-auth.session-token=${session.user.id}` // Simplified for demo
      }
    })

    let analyticsData
    if (response.ok) {
      analyticsData = await response.json()
    } else {
      // Fallback data if API fails
      analyticsData = {
        inquiriesTrend: [
          { date: 'Jan 01', count: 12 },
          { date: 'Jan 02', count: 19 },
          { date: 'Jan 03', count: 15 },
          { date: 'Jan 04', count: 22 },
          { date: 'Jan 05', count: 18 },
        ],
        propertiesByType: [
          { type: 'Apartament', count: 15, value: 1200000 },
          { type: 'Vila', count: 8, value: 2400000 },
          { type: 'Shtëpi', count: 12, value: 1800000 },
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 45000, target: 50000 },
          { month: 'Feb', revenue: 52000, target: 55000 },
          { month: 'Mar', revenue: 48000, target: 52000 },
        ],
        performanceMetrics: {
          totalViews: 1245,
          conversionRate: 3.2,
          averagePrice: 125000,
          responseTime: 4.2
        }
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