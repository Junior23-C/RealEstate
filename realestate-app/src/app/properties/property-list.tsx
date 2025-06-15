import { prisma } from "@/lib/db"
import { PropertyCard } from "@/components/property-card"
import { PropertyStatus, PropertyType } from "@/lib/constants"
import { Prisma } from "@prisma/client"
import { SmartSearchParams } from "@/lib/smart-search"

interface PropertyListProps {
  searchParams?: {
    status?: string
    type?: string
    bedrooms?: string
    bathrooms?: string
    minPrice?: string
    maxPrice?: string
    location?: string
    features?: string
  }
  smartSearchParams?: SmartSearchParams
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nearbyProperties?: any[]
}

export async function PropertyList({ searchParams, smartSearchParams, nearbyProperties }: PropertyListProps = {}) {
  // If nearby properties are provided, use them directly
  if (nearbyProperties && nearbyProperties.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearbyProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    )
  }

  const where: Prisma.PropertyWhereInput = {}
  
  // Apply smart search parameters first
  if (smartSearchParams) {
    if (smartSearchParams.bedrooms) {
      where.bedrooms = { gte: smartSearchParams.bedrooms }
    }
    if (smartSearchParams.bathrooms) {
      where.bathrooms = { gte: smartSearchParams.bathrooms }
    }
    if (smartSearchParams.minPrice || smartSearchParams.maxPrice) {
      const priceFilter: Prisma.FloatFilter = {}
      if (smartSearchParams.minPrice) priceFilter.gte = smartSearchParams.minPrice
      if (smartSearchParams.maxPrice) priceFilter.lte = smartSearchParams.maxPrice
      where.price = priceFilter
    }
    if (smartSearchParams.type) {
      where.type = smartSearchParams.type as PropertyType
    }
    if (smartSearchParams.status) {
      where.status = smartSearchParams.status as PropertyStatus
    }
    if (smartSearchParams.location) {
      where.OR = [
        { city: { contains: smartSearchParams.location } },
        { state: { contains: smartSearchParams.location } },
        { address: { contains: smartSearchParams.location } },
      ]
    }
  }
  
  // Apply regular search parameters if no smart search
  if (!smartSearchParams) {
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

    if (searchParams?.location) {
      where.OR = [
        { city: { contains: searchParams.location } },
        { state: { contains: searchParams.location } },
        { address: { contains: searchParams.location } },
      ]
    }
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