import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard"
import { prisma } from "@/lib/db"
import { getCachedAdminStats } from "@/lib/cache"

// Add metadata for better SEO and performance
export const metadata = {
  title: "Paneli i Adminit - Aliaj Real Estate",
  description: "Paneli i administrimit për menaxhimin e pronave dhe pyetjeve",
  robots: "noindex, nofollow" // Admin pages shouldn't be indexed
}

// Enable static rendering with revalidation for better performance
export const revalidate = 300 // 5 minutes

export default async function AdminPage() {
  // Optimize authentication check
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  try {
    // Use cached data instead of direct database queries
    const adminData = await getCachedAdminStats(prisma)

    return (
      <AdminDashboard 
        stats={{
          totalProperties: adminData.totalProperties,
          totalInquiries: adminData.totalInquiries,
          forRent: adminData.stats.forRent,
          forSale: adminData.stats.forSale
        }}
        recentInquiries={adminData.recentInquiries}
      />
    )
  } catch (error) {
    console.error("Error loading admin dashboard:", error)
    
    // Fallback to basic stats if cache fails
    const fallbackStats = {
      totalProperties: 0,
      totalInquiries: 0,
      forRent: 0,
      forSale: 0
    }

    return (
      <AdminDashboard 
        stats={fallbackStats}
        recentInquiries={[]}
      />
    )
  }
}