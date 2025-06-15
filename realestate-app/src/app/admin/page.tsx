import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard"
import AdminLayout from "@/components/admin/admin-layout"
import { prisma } from "@/lib/db"

// Add metadata for better SEO and performance
export const metadata = {
  title: "Paneli i Adminit - Aliaj Real Estate",
  description: "Paneli i administrimit për menaxhimin e pronave dhe pyetjeve",
  robots: "noindex, nofollow" // Admin pages shouldn't be indexed
}

// Cache dashboard for 1 minute
export const revalidate = 60

export default async function AdminPage() {
  // Optimize authentication check
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  try {
    // Optimized parallel queries with minimal data selection
    const [totalProperties, totalInquiries, recentInquiries, propertyStats] = await Promise.all([
      prisma.property.count(),
      prisma.inquiry.count(),
      prisma.inquiry.findMany({
        take: 3, // Reduced from 5 to 3
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
          property: {
            select: {
              title: true
            }
          }
        }
      }),
      prisma.property.groupBy({
        by: ["status"],
        _count: true
      })
    ])

    const stats = {
      totalProperties,
      totalInquiries,
      forRent: propertyStats.find(s => s.status === "FOR_RENT")?._count || 0,
      forSale: propertyStats.find(s => s.status === "FOR_SALE")?._count || 0,
    }

    return (
      <AdminLayout user={session.user}>
        <AdminDashboard 
          stats={stats}
          recentInquiries={recentInquiries}
        />
      </AdminLayout>
    )
  } catch (error) {
    console.error("Error loading admin dashboard:", error)
    
    // Fallback to basic stats if database fails
    const fallbackStats = {
      totalProperties: 0,
      totalInquiries: 0,
      forRent: 0,
      forSale: 0
    }

    return (
      <AdminLayout user={session?.user}>
        <AdminDashboard 
          stats={fallbackStats}
          recentInquiries={[]}
        />
      </AdminLayout>
    )
  }
}