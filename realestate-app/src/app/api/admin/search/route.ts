import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"
import { AuditTrail } from "@/lib/audit-trail"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(
      `search:${session.user.id}`,
      { requests: 30, window: 60 } // 30 requests per minute
    )

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Shumë kërkime. Provoni përsëri pas pak sekondash.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json({ 
        properties: [],
        tenants: [],
        inquiries: [],
        leases: [],
        totalResults: 0
      })
    }

    // Search across all entities in parallel
    const [properties, tenants, inquiries, leases] = await Promise.all([
      // Search Properties
      prisma.property.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { address: { contains: query } },
            { city: { contains: query } },
            { state: { contains: query } },
            { description: { contains: query } }
          ]
        },
        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          state: true,
          price: true,
          type: true,
          status: true,
          images: {
            where: { isPrimary: true },
            select: { url: true, alt: true }
          }
        },
        take: 10
      }),

      // Search Tenants
      prisma.tenant.findMany({
        where: {
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
            { phone: { contains: query } }
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          leases: {
            where: { status: 'ACTIVE' },
            select: {
              id: true,
              property: {
                select: { title: true, address: true }
              }
            }
          }
        },
        take: 10
      }),

      // Search Inquiries
      prisma.inquiry.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { message: { contains: query } }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          message: true,
          status: true,
          createdAt: true,
          property: {
            select: { id: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Search Leases
      prisma.lease.findMany({
        where: {
          OR: [
            { leaseNumber: { contains: query } },
            { tenant: {
              OR: [
                { firstName: { contains: query } },
                { lastName: { contains: query } }
              ]
            }},
            { property: {
              OR: [
                { title: { contains: query } },
                { address: { contains: query } }
              ]
            }}
          ]
        },
        select: {
          id: true,
          leaseNumber: true,
          status: true,
          monthlyRent: true,
          startDate: true,
          endDate: true,
          tenant: {
            select: { firstName: true, lastName: true }
          },
          property: {
            select: { title: true, address: true }
          }
        },
        take: 10
      })
    ])

    const totalResults = properties.length + tenants.length + inquiries.length + leases.length

    // Log search for analytics
    await AuditTrail.logSuccess(
      session.user.id,
      'READ' as const,
      'GlobalSearch',
      undefined,
      { query, resultsCount: totalResults },
      request
    )

    return NextResponse.json({
      properties: properties.map(p => ({
        ...p,
        type: 'property',
        href: `/admin/properties/${p.id}`
      })),
      tenants: tenants.map(t => ({
        ...t,
        type: 'tenant',
        href: `/admin/rentals/tenants/${t.id}`
      })),
      inquiries: inquiries.map(i => ({
        ...i,
        type: 'inquiry',
        href: `/admin/inquiries/${i.id}`
      })),
      leases: leases.map(l => ({
        ...l,
        type: 'lease',
        href: `/admin/rentals/leases/${l.id}`
      })),
      totalResults
    })

  } catch (error) {
    console.error('Global search error:', error)
    return NextResponse.json(
      { error: 'Kërkimi dështoi. Provoni përsëri.' },
      { status: 500 }
    )
  }
}