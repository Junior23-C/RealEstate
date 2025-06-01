import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PropertyManagement } from "./property-management"

export default async function AdminPropertiesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const properties = await prisma.property.findMany({
    include: {
      images: true,
      _count: {
        select: { inquiries: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return <PropertyManagement properties={properties} />
}