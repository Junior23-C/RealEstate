import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PropertyManagement } from "./property-management"

// Add metadata for better SEO
export const metadata = {
  title: "Menaxhimi i Pronave - Paneli Administrativ",
  description: "Menaxhoni të gjitha listimet e pronave të paluajtshme",
}

// Cache for 5 minutes
export const revalidate = 300

export default async function AdminPropertiesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Optimized query with specific field selection
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
          isPrimary: true,
          propertyId: true,
          createdAt: true
        }
      },
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