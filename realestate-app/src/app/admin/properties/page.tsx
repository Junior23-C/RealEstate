import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PropertyManagement } from "./property-management"
import AdminLayout from "@/components/admin/admin-layout"

// Add metadata for better SEO
export const metadata = {
  title: "Menaxhimi i Pronave - Paneli Administrativ",
  description: "Menaxhoni të gjitha listimet e pronave të paluajtshme",
}

// Cache for 2 minutes for faster updates
export const revalidate = 120

export default async function AdminPropertiesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Highly optimized query - only essential fields and limit images
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      title: true,
      city: true,
      state: true,
      type: true,
      status: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      squareFeet: true,
      createdAt: true,
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          isPrimary: true
        },
        where: {
          isPrimary: true
        },
        take: 1
      },
      _count: {
        select: { inquiries: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 50 // Limit to 50 properties for pagination
  })

  return (
    <AdminLayout user={session.user}>
      <PropertyManagement properties={properties} />
    </AdminLayout>
  )
}