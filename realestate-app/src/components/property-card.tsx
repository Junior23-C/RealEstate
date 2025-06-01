"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bed, Bath, Square, MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    type: string
    status: string
    address: string
    city: string
    state: string
    bedrooms: number
    bathrooms: number
    squareFeet: number
    images: { url: string; alt?: string | null; isPrimary: boolean }[]
  }
  index?: number
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0]
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "FOR_RENT":
        return "For Rent"
      case "FOR_SALE":
        return "For Sale"
      case "RENTED":
        return "Rented"
      case "SOLD":
        return "Sold"
      default:
        return status.replace("_", " ")
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "HOUSE":
        return "House"
      case "APARTMENT":
        return "Apartment"
      case "CONDO":
        return "Condo"
      case "TOWNHOUSE":
        return "Townhouse"
      case "LAND":
        return "Land"
      case "COMMERCIAL":
        return "Commercial"
      default:
        return type.replace("_", " ")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link href={`/properties/${property.id}`}>
          <div className="relative h-64 w-full overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || property.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <Square className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
                {getStatusLabel(property.status)}
              </span>
              <span className="bg-background/90 backdrop-blur px-3 py-1 rounded-md text-sm font-medium">
                {getTypeLabel(property.type)}
              </span>
            </div>
          </div>
        </Link>
        
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-2">
            {formatPrice(property.price)}
            {property.status === "FOR_RENT" && <span className="text-base font-normal">/month</span>}
          </h3>
          
          <h4 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h4>
          
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.city}, {property.state}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span>{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button asChild className="w-full">
            <Link href={`/properties/${property.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}