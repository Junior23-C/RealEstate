import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ComprehensiveAnalyticsDashboard } from "@/components/admin/comprehensive-analytics-dashboard"
import AdminLayout from "@/components/admin/admin-layout"

// Add metadata
export const metadata = {
  title: "Analitika - Paneli Administrativ",
  description: "Analitika dhe raporte të përmisruara për menaxhimin e pronave",
}

// Cache for 3 minutes for near real-time data
export const revalidate = 180

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Get initial analytics data for faster page load
  let initialData
  try {
    // Fetch initial data from our comprehensive API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/admin/analytics?period=30d`, {
      headers: {
        'Cookie': `next-auth.session-token=${session.user.id}` // Pass session for server-side auth
      }
    })
    
    if (response.ok) {
      initialData = await response.json()
    }
  } catch (error) {
    console.error("Error fetching initial analytics data:", error)
    // Will use fallback in component
  }

  return (
    <AdminLayout user={session.user}>
      <ComprehensiveAnalyticsDashboard initialData={initialData} />
    </AdminLayout>
  )
}