// Optimized database queries for admin dashboard
import { prisma } from "@/lib/db"
import { cacheDashboardStats, cachePropertyListings, cacheRentalDashboard, cacheTenantData } from "@/lib/cache"

/**
 * Get dashboard statistics with caching
 */
export async function getDashboardStats() {
  return cacheDashboardStats(async () => {
    // Use Promise.all for parallel execution
    const [totalProperties, totalInquiries, propertyStats] = await Promise.all([
      prisma.property.count(),
      prisma.inquiry.count(),
      prisma.property.groupBy({
        by: ["status"],
        _count: true
      })
    ])

    return {
      totalProperties,
      totalInquiries,
      forRent: propertyStats.find(s => s.status === "FOR_RENT")?._count || 0,
      forSale: propertyStats.find(s => s.status === "FOR_SALE")?._count || 0,
    }
  })
}

/**
 * Get recent inquiries with minimal data
 */
export async function getRecentInquiries(limit = 5) {
  return cacheDashboardStats(async () => {
    return prisma.inquiry.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        property: {
          select: {
            title: true
          }
        }
      }
    })
  })
}

/**
 * Get optimized property listings for admin
 */
export async function getAdminProperties() {
  return cachePropertyListings(async () => {
    return prisma.property.findMany({
      select: {
        id: true,
        title: true,
        city: true,
        state: true,
        type: true,
        status: true,
        price: true,
        rentedDate: true,
        rentEndDate: true,
        tenantName: true,
        tenantEmail: true,
        tenantPhone: true,
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            isPrimary: true,
            propertyId: true,
            createdAt: true
          },
          orderBy: {
            isPrimary: 'desc' // Primary images first
          }
        },
        _count: {
          select: { inquiries: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  })
}

/**
 * Get rental dashboard statistics
 */
export async function getRentalStats() {
  return cacheRentalDashboard(async () => {
    const [
      totalLeases,
      activeLeases,
      expiringSoonLeases,
      overduePayments,
      rentedProperties,
      availableProperties,
      totalMonthlyRent
    ] = await Promise.all([
      prisma.lease.count(),
      prisma.lease.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.lease.count({
        where: {
          status: 'ACTIVE',
          endDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          }
        }
      }),
      prisma.payment.count({
        where: { 
          status: 'LATE'
        }
      }),
      prisma.property.count({
        where: { status: 'RENTED' }
      }),
      prisma.property.count({
        where: { status: 'FOR_RENT' }
      }),
      prisma.lease.aggregate({
        where: { status: 'ACTIVE' },
        _sum: { monthlyRent: true }
      })
    ])

    return {
      totalLeases,
      activeLeases,
      expiringSoon: expiringSoonLeases,
      overduePayments,
      rentedProperties,
      availableProperties,
      totalMonthlyRent: totalMonthlyRent._sum.monthlyRent || 0
    }
  })
}

/**
 * Get active leases with related data
 */
export async function getActiveLeases() {
  return cacheRentalDashboard(async () => {
    return prisma.lease.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        monthlyRent: true,
        status: true,
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            images: {
              select: {
                url: true,
                alt: true
              },
              where: { isPrimary: true },
              take: 1
            }
          }
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            dueDate: true,
            paidDate: true,
            status: true
          },
          orderBy: { dueDate: 'desc' },
          take: 1 // Only latest payment
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })
  })
}

/**
 * Get recent and upcoming payments
 */
export async function getPaymentData() {
  return cacheRentalDashboard(async () => {
    const [recentPayments, upcomingPayments] = await Promise.all([
      // Recent payments (last 30 days)
      prisma.payment.findMany({
        where: {
          status: 'PAID',
          paidDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          id: true,
          amount: true,
          paidDate: true,
          paymentMethod: true,
          lease: {
            select: {
              property: {
                select: { title: true }
              },
              tenant: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { paidDate: 'desc' },
        take: 10
      }),
      
      // Upcoming payments (next 60 days)
      prisma.payment.findMany({
        where: {
          status: { in: ['PENDING', 'LATE'] },
          dueDate: {
            lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          id: true,
          amount: true,
          dueDate: true,
          status: true,
          lease: {
            select: {
              property: {
                select: { title: true }
              },
              tenant: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { dueDate: 'asc' },
        take: 20
      })
    ])

    return { recentPayments, upcomingPayments }
  })
}

/**
 * Get all tenants with lease information
 */
export async function getTenantsWithLeases() {
  return cacheTenantData(async () => {
    return prisma.tenant.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        employer: true,
        monthlyIncome: true,
        emergencyContact: true,
        emergencyContactPhone: true,
        createdAt: true,
        leases: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            monthlyRent: true,
            status: true,
            property: {
              select: {
                id: true,
                title: true,
                address: true,
                city: true,
                state: true
              }
            },
            payments: {
              select: {
                id: true,
                amount: true,
                dueDate: true,
                paidDate: true,
                status: true
              },
              orderBy: { dueDate: 'desc' },
              take: 1 // Only latest payment
            }
          },
          orderBy: { startDate: 'desc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  })
}

/**
 * Get property by ID with all related data
 */
export async function getPropertyById(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { isPrimary: 'desc' }
      },
      inquiries: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      leases: {
        include: {
          tenant: true,
          payments: {
            orderBy: { dueDate: 'desc' },
            take: 5
          }
        },
        orderBy: { startDate: 'desc' }
      }
    }
  })
}

/**
 * Get tenant by ID with lease history
 */
export async function getTenantById(id: string) {
  return prisma.tenant.findUnique({
    where: { id },
    include: {
      leases: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
              city: true,
              state: true
            }
          },
          payments: {
            orderBy: { dueDate: 'desc' }
          }
        },
        orderBy: { startDate: 'desc' }
      }
    }
  })
}