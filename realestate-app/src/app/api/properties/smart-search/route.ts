import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { parseNaturalLanguageQuery } from "@/lib/smart-search"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return new NextResponse("Query is required", { status: 400 })
    }

    // Parse natural language query
    const searchParams = parseNaturalLanguageQuery(query)
    
    // Build Prisma where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {}
    
    if (searchParams.bedrooms) {
      whereClause.bedrooms = { gte: searchParams.bedrooms }
    }
    
    if (searchParams.bathrooms) {
      whereClause.bathrooms = { gte: searchParams.bathrooms }
    }
    
    if (searchParams.minPrice || searchParams.maxPrice) {
      whereClause.price = {}
      if (searchParams.minPrice) whereClause.price.gte = searchParams.minPrice
      if (searchParams.maxPrice) whereClause.price.lte = searchParams.maxPrice
    }
    
    if (searchParams.type) {
      whereClause.type = searchParams.type
    }
    
    if (searchParams.status) {
      whereClause.status = searchParams.status
    }
    
    if (searchParams.location) {
      whereClause.OR = [
        { city: { contains: searchParams.location } },
        { state: { contains: searchParams.location } },
        { address: { contains: searchParams.location } },
      ]
    }
    
    // Handle features - search in features JSON field
    if (searchParams.features && searchParams.features.length > 0) {
      // This assumes features are stored as JSON array
      whereClause.features = {
        hasSome: searchParams.features
      }
    }

    // Execute search query
    const properties = await prisma.property.findMany({
      where: whereClause,
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
        zipCode: true,
        bedrooms: true,
        bathrooms: true,
        squareFeet: true,
        features: true,
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
      orderBy: [
        { createdAt: 'desc' }
      ],
      take: 50 // Limit results for performance
    })

    return NextResponse.json({
      properties,
      searchParams,
      count: properties.length,
      query: query
    })
  } catch (error) {
    console.error("Smart search error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}