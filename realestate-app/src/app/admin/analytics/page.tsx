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

  return (
    <AdminLayout user={session.user}>
      <ComprehensiveAnalyticsDashboard />
    </AdminLayout>
  )
}