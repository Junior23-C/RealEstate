import { Suspense } from "react"
import { NavbarWrapper } from "@/components/navbar-wrapper"
import { Footer } from "@/components/footer"
import { FloatingFilterButton } from "@/components/floating-filter-button"
import { PropertiesPageClient } from "./properties-page-client"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { PropertyStatus, PropertyType } from "@/lib/constants"


interface PropertiesPageProps {
  searchParams: Promise<{
    status?: string
    type?: string
    bedrooms?: string
    bathrooms?: string
  }>
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams
  
  // Build where clause based on search params
  const where: Prisma.PropertyWhereInput = {}
  
  if (params.status && params.status !== 'all') {
    where.status = params.status as PropertyStatus
  }
  
  if (params.type && params.type !== 'all') {
    where.type = params.type as PropertyType
  }
  
  if (params.bedrooms && params.bedrooms !== 'all') {
    where.bedrooms = { gte: parseInt(params.bedrooms) }
  }
  
  if (params.bathrooms && params.bathrooms !== 'all') {
    where.bathrooms = { gte: parseInt(params.bathrooms) }
  }
  
  // Fetch initial properties for the page
  const properties = await prisma.property.findMany({
    where,
    include: {
      images: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Limit for performance
  })
  return (
    <div className="min-h-screen">
      <NavbarWrapper />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Shfletoni Pronat</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Përdorni kërkimin e mençur, gjetjen me vendndodhje, ose kalkulatorin e valutave
          </p>
        </div>

        <PropertiesPageClient 
          initialProperties={properties.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            city: p.city,
            state: p.state,
            type: p.type,
            status: p.status,
            address: p.address,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            squareFeet: p.squareFeet,
            images: p.images.map(img => ({
              url: img.url,
              alt: img.alt,
              isPrimary: img.isPrimary
            })),
            description: p.description,
            features: p.features || undefined
          }))}
        />
      </div>
      
      {/* Floating filter button for mobile */}
      <Suspense fallback={null}>
        <FloatingFilterButton />
      </Suspense>
      
      <Footer />
    </div>
  )
}