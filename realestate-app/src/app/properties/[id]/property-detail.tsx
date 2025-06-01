"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bed, Bath, Square, Calendar, MapPin, Home, 
  ChevronLeft, ChevronRight, X, Maximize2
} from "lucide-react"
import { InquiryForm } from "./inquiry-form"

interface PropertyDetailProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    type: string
    status: string
    address: string
    city: string
    state: string
    zipCode: string
    bedrooms: number
    bathrooms: number
    squareFeet: number
    lotSize?: number | null
    yearBuilt?: number | null
    features?: string | null
    createdAt: Date
    updatedAt: Date
    images: Array<{
      id: string
      url: string
      alt?: string | null
      isPrimary: boolean
    }>
    _count: {
      inquiries: number
    }
  }
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showInquiryForm, setShowInquiryForm] = useState(false)

  const features = property.features ? JSON.parse(property.features) : []

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  return (
    <>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Image Gallery */}
          <div className="relative mb-8">
            <div className="relative h-[60vh] rounded-lg overflow-hidden">
              {property.images.length > 0 ? (
                <>
                  <Image
                    src={property.images[currentImageIndex].url}
                    alt={property.images[currentImageIndex].alt || property.title}
                    fill
                    className="object-cover"
                  />
                  
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full hover:bg-background transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur p-2 rounded-full hover:bg-background transition-colors"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <Home className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {property.images.map((image, index: number) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 w-32 rounded-md overflow-hidden flex-shrink-0 ${
                      index === currentImageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Property Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(property.price)}
                      {property.status === "FOR_RENT" && <span className="text-lg font-normal">/month</span>}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge>{getStatusLabel(property.status)}</Badge>
                      <Badge variant="outline">{getTypeLabel(property.type)}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Square Feet</p>
                        <p className="font-semibold">{property.squareFeet.toLocaleString()}</p>
                      </div>
                    </div>
                    {property.yearBuilt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Year Built</p>
                          <p className="font-semibold">{property.yearBuilt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {property.lotSize && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Lot Size</p>
                      <p className="font-semibold">{property.lotSize} acres</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
                </CardContent>
              </Card>

              {/* Features */}
              {features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Features & Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interested in this property?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Contact us today to schedule a viewing or get more information about this property.
                  </p>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowInquiryForm(true)}
                  >
                    Send Inquiry
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    or call us at
                  </div>
                  <Button variant="outline" className="w-full" size="lg">
                    (555) 123-4567
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listed</span>
                      <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property ID</span>
                      <span className="font-mono">{property.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inquiries</span>
                      <span>{property._count.inquiries}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Image Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="h-full w-full flex items-center justify-center p-8">
            <div className="relative h-full w-full max-w-7xl">
              <Image
                src={property.images[currentImageIndex].url}
                alt={property.images[currentImageIndex].alt || property.title}
                fill
                className="object-contain"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form Modal */}
      {showInquiryForm && (
        <InquiryForm 
          propertyId={property.id} 
          propertyTitle={property.title}
          onClose={() => setShowInquiryForm(false)} 
        />
      )}
    </>
  )
}