import { prisma } from "@/lib/db"
import { PropertyCard } from "@/components/property-card"
import { PropertyStatus, PropertyType } from "@/lib/constants"
import { Prisma } from "@prisma/client"

interface PropertyListProps {
  searchParams?: {
    status?: string
    type?: string
    bedrooms?: string
    bathrooms?: string
    minPrice?: string
    maxPrice?: string
  }
}

export async function PropertyList({ searchParams }: PropertyListProps = {}) {
  const where: Prisma.PropertyWhereInput = {}
  
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
  
  if (searchParams?.minPrice || searchParams?.maxPrice) {
    const priceFilter: Prisma.FloatFilter = {}
    if (searchParams.minPrice) {
      priceFilter.gte = parseFloat(searchParams.minPrice)
    }
    if (searchParams.maxPrice) {
      priceFilter.lte = parseFloat(searchParams.maxPrice)
    }
    where.price = priceFilter
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
        <p className="text-lg text-muted-foreground">Nuk u gjetën prona që përputhen me kriteret tuaja.</p>
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