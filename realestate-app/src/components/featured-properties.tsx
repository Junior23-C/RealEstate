import { prisma } from "@/lib/db"
import { PropertyCard } from "@/components/property-card"
import { PropertyStatus } from "@/lib/constants"

export async function FeaturedProperties() {
  const properties = await prisma.property.findMany({
    where: {
      status: {
        in: [PropertyStatus.FOR_SALE, PropertyStatus.FOR_RENT]
      }
    },
    include: {
      images: true
    },
    take: 3,
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No properties available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property, index) => (
        <PropertyCard key={property.id} property={property} index={index} />
      ))}
    </div>
  )
}