import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboardServer } from "./admin-dashboard-server"
import { getDashboardStats, getRecentInquiries } from "@/lib/queries/admin-queries"

// Add metadata for better SEO and performance
export const metadata = {
  title: "Admin Dashboard - Real Estate Management",
  description: "Manage properties, tenants, and inquiries",
}

// Optimize cache settings
export const revalidate = 300 // 5 minutes

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Use optimized cached queries
  const [stats, recentInquiries] = await Promise.all([
    getDashboardStats(),
    getRecentInquiries(5)
  ])

  return (
    <AdminDashboardServer 
      stats={stats} 
      recentInquiries={recentInquiries} 
      user={session.user}
    />
  )
}