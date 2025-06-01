import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard"
import { prisma } from "@/lib/db"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Get statistics
  const [totalProperties, totalInquiries, recentInquiries, propertyStats] = await Promise.all([
    prisma.property.count(),
    prisma.inquiry.count(),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { property: true }
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

  return <AdminDashboard stats={stats} recentInquiries={recentInquiries} />
}