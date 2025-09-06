import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { parseNaturalLanguageQuery } from "@/lib/smart-search"

// Simple in-memory cache for search results
interface CacheEntry {
  data: {
    properties: unknown[]
    searchParams: unknown
    count: number
    query: string
  }
  timestamp: number
}
const searchCache = new Map<string, CacheEntry>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return new NextResponse("Query is required", { status: 400 })
    }

    // Check cache first
    const cacheKey = query.toLowerCase().trim()
    const cached = searchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
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

    // Execute optimized search query
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
        bedrooms: true,
        bathrooms: true,
        squareFeet: true,
        features: true,
        images: {
          select: {
            url: true,
            alt: true,
            isPrimary: true
          },
          where: {
            isPrimary: true
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 24 // Optimized limit
    })

    const result = {
      properties,
      searchParams,
      count: properties.length,
      query: query
    }

    // Cache the result
    searchCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    })

    // Clean up old cache entries (simple cleanup)
    if (searchCache.size > 100) {
      const entries = Array.from(searchCache.entries())
      entries.slice(0, 50).forEach(([key]) => searchCache.delete(key))
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Smart search error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}