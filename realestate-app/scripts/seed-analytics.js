const { PrismaClient } = require('@prisma/client')
const { subDays, subHours, subMinutes } = require('date-fns')

const prisma = new PrismaClient()

async function seedAnalyticsData() {
  console.log('🌱 Seeding analytics data...')

  try {
    // Get existing properties for realistic data
    const properties = await prisma.property.findMany()
    const inquiries = await prisma.inquiry.findMany()

    if (properties.length === 0) {
      console.log('❌ No properties found. Please run the main seed script first.')
      return
    }

    // Generate realistic session IDs and user agents
    const sessionIds = Array.from({ length: 150 }, (_, i) => `session_${Date.now()}_${i}`)
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
    ]
    const locations = ['Tiranë, Albania', 'Durrës, Albania', 'Vlorë, Albania', 'Shkodër, Albania', 'Unknown']
    const sources = ['organic', 'direct', 'social', 'referral']
    const referrers = [
      'https://google.com/search',
      'https://facebook.com',
      'https://instagram.com',
      'https://linkedin.com',
      null
    ]

    // 1. Seed User Sessions (last 30 days)
    console.log('Creating user sessions...')
    const userSessions = []
    for (let i = 0; i < 100; i++) {
      const startedAt = subHours(new Date(), Math.random() * 24 * 30) // Random time in last 30 days
      const duration = Math.floor(Math.random() * 1800) + 60 // 1-30 minutes
      const pageViews = Math.floor(Math.random() * 10) + 1

      userSessions.push({
        sessionId: sessionIds[i],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        landingPage: Math.random() > 0.5 ? '/' : `/properties/${properties[Math.floor(Math.random() * properties.length)].id}`,
        pageViews: pageViews,
        duration: duration,
        isBot: Math.random() < 0.1, // 10% bots
        startedAt: startedAt,
        lastActivity: new Date(startedAt.getTime() + duration * 1000),
        endedAt: Math.random() > 0.2 ? new Date(startedAt.getTime() + duration * 1000) : null
      })
    }

    await prisma.userSession.createMany({
      data: userSessions
    })

    // 2. Seed Page Views
    console.log('Creating page views...')
    const pageViews = []
    const pages = ['/', '/properties', '/contact', '/about']
    
    for (let i = 0; i < 500; i++) {
      const createdAt = subHours(new Date(), Math.random() * 24 * 30)
      const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)]
      
      pageViews.push({
        path: Math.random() > 0.3 ? pages[Math.floor(Math.random() * pages.length)] : `/properties/${properties[Math.floor(Math.random() * properties.length)].id}`,
        title: 'Real Estate Albania - Property Page',
        sessionId: sessionId,
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        referrer: Math.random() > 0.5 ? referrers[Math.floor(Math.random() * referrers.length)] : null,
        location: locations[Math.floor(Math.random() * locations.length)],
        loadTime: Math.floor(Math.random() * 3000) + 500, // 500ms to 3.5s
        createdAt: createdAt
      })
    }

    await prisma.pageView.createMany({
      data: pageViews
    })

    // 3. Seed Property Views
    console.log('Creating property views...')
    const propertyViews = []
    for (let i = 0; i < 300; i++) {
      const createdAt = subHours(new Date(), Math.random() * 24 * 30)
      const duration = Math.floor(Math.random() * 600) + 30 // 30s to 10 minutes
      const property = properties[Math.floor(Math.random() * properties.length)]
      
      propertyViews.push({
        propertyId: property.id,
        sessionId: sessionIds[Math.floor(Math.random() * sessionIds.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        duration: duration,
        source: sources[Math.floor(Math.random() * sources.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        createdAt: createdAt
      })
    }

    await prisma.propertyView.createMany({
      data: propertyViews
    })

    // 4. Seed Search Queries
    console.log('Creating search queries...')
    const searchQueries = [
      'apartament tirane', 'shtepi me qera', 'prona per shitje', 'villa durrës',
      '2+1 apartament', 'penthouse tirane', 'studio apartment', 'commercial property',
      'luxury villa', 'sea view property', 'central tirana', 'new construction'
    ]
    
    const searches = []
    for (let i = 0; i < 150; i++) {
      const createdAt = subHours(new Date(), Math.random() * 24 * 30)
      const query = searchQueries[Math.floor(Math.random() * searchQueries.length)]
      
      searches.push({
        query: query,
        filters: Math.random() > 0.5 ? JSON.stringify({
          type: ['APARTMENT', 'HOUSE'][Math.floor(Math.random() * 2)],
          priceRange: { min: 50000, max: 200000 }
        }) : null,
        results: Math.floor(Math.random() * 20) + 1,
        sessionId: sessionIds[Math.floor(Math.random() * sessionIds.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        createdAt: createdAt
      })
    }

    await prisma.searchQuery.createMany({
      data: searches
    })

    // 5. Seed Analytics Events
    console.log('Creating analytics events...')
    const eventTypes = ['PAGE_VIEW', 'PROPERTY_VIEW', 'CONTACT_CLICK', 'PHONE_CLICK', 'EMAIL_CLICK', 'WHATSAPP_CLICK', 'SEARCH', 'INQUIRY_SUBMIT']
    const events = []
    
    for (let i = 0; i < 400; i++) {
      const createdAt = subHours(new Date(), Math.random() * 24 * 30)
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const property = properties[Math.floor(Math.random() * properties.length)]
      
      events.push({
        type: eventType,
        category: eventType.includes('CLICK') ? 'User Interaction' : eventType === 'SEARCH' ? 'Search' : 'Navigation',
        action: eventType.replace('_', ' '),
        label: eventType.includes('PROPERTY') ? property.title : null,
        value: eventType === 'PROPERTY_VIEW' ? Math.floor(Math.random() * 300) + 30 : null,
        propertyId: eventType.includes('PROPERTY') || eventType.includes('CLICK') ? property.id : null,
        inquiryId: eventType === 'INQUIRY_SUBMIT' && inquiries.length > 0 ? inquiries[Math.floor(Math.random() * inquiries.length)].id : null,
        sessionId: sessionIds[Math.floor(Math.random() * sessionIds.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        metadata: eventType === 'SEARCH' ? JSON.stringify({ query: searchQueries[Math.floor(Math.random() * searchQueries.length)] }) : null,
        createdAt: createdAt
      })
    }

    await prisma.analyticsEvent.createMany({
      data: events
    })

    // 6. Seed Inquiry Responses (for existing inquiries)
    console.log('Creating inquiry responses...')
    if (inquiries.length > 0) {
      const inquiryResponses = []
      
      for (const inquiry of inquiries.slice(0, Math.min(inquiries.length, 20))) {
        const responded = Math.random() > 0.3 // 70% response rate
        if (responded) {
          const responseTime = Math.floor(Math.random() * 1440) + 30 // 30 minutes to 24 hours
          const respondedAt = new Date(inquiry.createdAt.getTime() + responseTime * 60 * 1000)
          
          inquiryResponses.push({
            inquiryId: inquiry.id,
            respondedAt: respondedAt,
            responseTime: responseTime,
            status: 'RESPONDED',
            respondedBy: 'admin@aliaj-re.com',
            method: ['EMAIL', 'PHONE', 'WHATSAPP'][Math.floor(Math.random() * 3)],
            notes: 'Initial response provided'
          })
        }
      }

      await prisma.inquiryResponse.createMany({
        data: inquiryResponses
      })
    }

    console.log('✅ Analytics data seeded successfully!')
    console.log(`📊 Created:`)
    console.log(`   - ${userSessions.length} user sessions`)
    console.log(`   - ${pageViews.length} page views`)
    console.log(`   - ${propertyViews.length} property views`)
    console.log(`   - ${searches.length} search queries`)
    console.log(`   - ${events.length} analytics events`)
    console.log(`   - ${inquiries.length > 0 ? Math.min(inquiries.length, 20) : 0} inquiry responses`)

  } catch (error) {
    console.error('❌ Error seeding analytics data:', error)
    throw error
  }
}

async function main() {
  try {
    await seedAnalyticsData()
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

module.exports = { seedAnalyticsData }