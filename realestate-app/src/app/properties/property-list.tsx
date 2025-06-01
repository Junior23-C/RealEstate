import { prisma } from "@/lib/db"
import { PropertyCard } from "@/components/property-card"
import { PropertyStatus, PropertyType } from "@/lib/constants"

interface PropertyListProps {
  searchParams?: {
    status?: string
    type?: string
    bedrooms?: string
    bathrooms?: string
  }
}

export async function PropertyList({ searchParams }: PropertyListProps = {}) {
  const where: Record<string, unknown> = {}
  
  if (searchParams?.status && searchParams.status !== "all") {
    where.status = searchParams.status as PropertyStatus
  }
  
  if (searchParams?.type && searchParams.type !== "all") {
    where.type = searchParams.type as PropertyType
  }
  
  if (searchParams?.bedrooms && searchParams.bedrooms !== "all") {
    where.bedrooms = { gte: parseInt(searchParams.bedrooms) }
  }
  
  if (searchParams?.bathrooms && searchParams.bathrooms !== "all") {
    where.bathrooms = { gte: parseInt(searchParams.bathrooms) }
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      images: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No properties found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <PropertyCard key={property.id} property={property} index={index} />
      ))}
    </div>
  )
}