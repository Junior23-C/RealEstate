import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Approximate coordinates for major Albanian cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'tirana': { lat: 41.3275, lng: 19.8187 },
  'tiranë': { lat: 41.3275, lng: 19.8187 },
  'durrës': { lat: 41.3226, lng: 19.4565 },
  'durres': { lat: 41.3226, lng: 19.4565 },
  'vlora': { lat: 40.4686, lng: 19.4833 },
  'vlorë': { lat: 40.4686, lng: 19.4833 },
  'shkodra': { lat: 42.0683, lng: 19.5126 },
  'shkodër': { lat: 42.0683, lng: 19.5126 },
  'elbasan': { lat: 41.1125, lng: 20.0822 },
  'korça': { lat: 40.6186, lng: 20.7808 },
  'korce': { lat: 40.6186, lng: 20.7808 },
  'fier': { lat: 40.7239, lng: 19.5561 },
  'berat': { lat: 40.7058, lng: 19.9444 },
  'lushnja': { lat: 40.9419, lng: 19.7050 },
  'lushnje': { lat: 40.9419, lng: 19.7050 },
  'kavaja': { lat: 41.1853, lng: 19.5569 },
  'kavajë': { lat: 41.1853, lng: 19.5569 },
  'gjirokastër': { lat: 40.0756, lng: 20.1390 },
  'gjirokaster': { lat: 40.0756, lng: 20.1390 },
  'sarandë': { lat: 39.8750, lng: 20.0028 },
  'saranda': { lat: 39.8750, lng: 20.0028 },
}

// Get approximate coordinates for a city
function getCityCoordinates(city: string): { lat: number; lng: number } | null {
  const normalizedCity = city.toLowerCase().trim()
  return cityCoordinates[normalizedCity] || null
}

export async function POST(request: Request) {
  try {
    const { latitude, longitude, maxDistance = 10 } = await request.json()
    
    if (!latitude || !longitude) {
      return new NextResponse("Latitude and longitude are required", { status: 400 })
    }

    // Fetch all properties (using city-based location for now)
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        type: true,
        status: true,
        address: true,
        city: true,
        state: true,
        bedrooms: true,
        bathrooms: true,
        squareFeet: true,
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
        createdAt: true
      },
      where: {
        status: {
          in: ['FOR_RENT', 'FOR_SALE']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter properties by distance using city coordinates
    const nearbyProperties = properties
      .map(property => {
        // Get coordinates from city name since we don't have lat/lng in DB yet
        const cityCoords = getCityCoordinates(property.city)
        if (!cityCoords) return null

        const distance = calculateDistance(latitude, longitude, cityCoords.lat, cityCoords.lng)
        
        return {
          ...property,
          latitude: cityCoords.lat,
          longitude: cityCoords.lng,
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        }
      })
      .filter((property): property is NonNullable<typeof property> => 
        property !== null && property.distance <= maxDistance
      )
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50) // Limit to 50 properties

    return NextResponse.json({
      properties: nearbyProperties,
      userLocation: { latitude, longitude },
      maxDistance,
      count: nearbyProperties.length
    })
  } catch (error) {
    console.error("Nearby properties search error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}