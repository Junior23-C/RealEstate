// Admin Dashboard Caching Utilities
import { unstable_cache } from 'next/cache'

// Cache configuration for different data types
export const CACHE_TAGS = {
  PROPERTIES: 'properties',
  INQUIRIES: 'inquiries',
  ADMIN_STATS: 'admin-stats',
  TENANTS: 'tenants',
  RENTALS: 'rentals'
} as const

// Cache durations (in seconds)
export const CACHE_DURATION = {
  STATS: 300,      // 5 minutes for dashboard stats
  PROPERTIES: 600, // 10 minutes for property lists
  INQUIRIES: 180,  // 3 minutes for inquiries
  TENANTS: 600,    // 10 minutes for tenant data
  RENTALS: 300     // 5 minutes for rental data
} as const

// Cached admin stats query
export const getCachedAdminStats = unstable_cache(
  async (prisma: any) => {
    const [totalProperties, totalInquiries, recentInquiries, propertyStats] = await Promise.all([
      prisma.property.count(),
      prisma.inquiry.count(),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          property: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      prisma.property.groupBy({
        by: ["status"],
        _count: true
      })
    ])

    return {
      totalProperties,
      totalInquiries,
      recentInquiries,
      stats: {
        forRent: propertyStats.find(s => s.status === "FOR_RENT")?._count || 0,
        forSale: propertyStats.find(s => s.status === "FOR_SALE")?._count || 0,
      }
    }
  },
  ['admin-stats'],
  {
    revalidate: CACHE_DURATION.STATS,
    tags: [CACHE_TAGS.ADMIN_STATS, CACHE_TAGS.PROPERTIES, CACHE_TAGS.INQUIRIES]
  }
)

// Cached properties query with pagination
export const getCachedProperties = unstable_cache(
  async (prisma: any, page: number = 1, limit: number = 10, search?: string) => {
    const offset = (page - 1) * limit
    
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { address: { contains: search, mode: 'insensitive' as const } },
        { city: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          type: true,
          city: true,
          state: true,
          bedrooms: true,
          bathrooms: true,
          squareFeet: true,
          createdAt: true,
          images: {
            where: { isPrimary: true },
            select: { url: true, alt: true },
            take: 1
          }
        }
      }),
      prisma.property.count({ where })
    ])

    return {
      properties,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    }
  },
  ['properties-paginated'],
  {
    revalidate: CACHE_DURATION.PROPERTIES,
    tags: [CACHE_TAGS.PROPERTIES]
  }
)

// Cached inquiries query
export const getCachedInquiries = unstable_cache(
  async (prisma: any, page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          createdAt: true,
          property: {
            select: {
              id: true,
              title: true,
              price: true
            }
          }
        }
      }),
      prisma.inquiry.count()
    ])

    return {
      inquiries,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    }
  },
  ['inquiries-paginated'],
  {
    revalidate: CACHE_DURATION.INQUIRIES,
    tags: [CACHE_TAGS.INQUIRIES]
  }
)

// Cache invalidation helpers
export const revalidateCache = {
  properties: () => {
    // This would be called after property mutations
    // revalidateTag(CACHE_TAGS.PROPERTIES)
  },
  inquiries: () => {
    // This would be called after inquiry mutations
    // revalidateTag(CACHE_TAGS.INQUIRIES)
  },
  adminStats: () => {
    // This would be called after any admin data changes
    // revalidateTag(CACHE_TAGS.ADMIN_STATS)
  }
}