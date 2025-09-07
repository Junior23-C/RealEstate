import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('Seeding analytics data for production...')

    // Check if we already have analytics data
    const existingInquiries = await prisma.inquiry.count()
    const existingAnalytics = await prisma.analyticsEvent.count()
    
    if (existingInquiries > 5 && existingAnalytics > 50) {
      return NextResponse.json({ 
        message: "Analytics data already exists", 
        inquiries: existingInquiries,
        analytics: existingAnalytics 
      })
    }

    // Get all properties to associate with analytics data
    const properties = await prisma.property.findMany()
    if (properties.length === 0) {
      return NextResponse.json({ error: "No properties found. Create some properties first." }, { status: 400 })
    }

    const results = {
      inquiries: 0,
      pageViews: 0,
      propertyViews: 0,
      userSessions: 0,
      searchQueries: 0,
      analyticsEvents: 0
    }

    // Create sample inquiries
    if (existingInquiries < 10) {
      const names = ['John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 'Michael Brown', 'Lisa Davis', 'Robert Taylor', 'Jennifer Anderson', 'William Thompson', 'Amanda Martinez']
      const messages = [
        'I am interested in this property. Can you provide more details?',
        'Is this property still available? I would like to schedule a viewing.',
        'Could you tell me more about the neighborhood and amenities?',
        'I am looking for a property in this area. Is this still on the market?',
        'What is the rental process for this property?'
      ]
      
      const inquiries = []
      for (let i = 0; i < 15; i++) {
        const property = properties[i % properties.length]
        const name = names[i % names.length]
        const email = name.toLowerCase().replace(' ', '.') + '@email.com'
        const message = messages[i % messages.length]
        
        const daysAgo = Math.floor(Math.random() * 30)
        const createdAt = new Date()
        createdAt.setDate(createdAt.getDate() - daysAgo)
        
        const statusOptions = ['PENDING', 'CONTACTED', 'CLOSED'] as const
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]
        
        inquiries.push({
          name,
          email,
          phone: '+1234567890',
          message,
          propertyId: property.id,
          status: randomStatus,
          createdAt,
          updatedAt: createdAt
        })
      }
      
      await prisma.inquiry.createMany({ data: inquiries })
      results.inquiries = inquiries.length
    }

    // Create page views
    const pages = ['/properties', '/contact', '/about', '/properties/1', '/properties/2', '/']
    const pageViews = []
    
    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const createdAt = new Date()
      createdAt.setDate(createdAt.getDate() - daysAgo)
      
      pageViews.push({
        path: pages[Math.floor(Math.random() * pages.length)],
        title: 'Page Title',
        sessionId: 'session-' + Math.floor(Math.random() * 20),
        createdAt
      })
    }
    
    await prisma.pageView.createMany({ data: pageViews })
    results.pageViews = pageViews.length

    // Create property views
    const propertyViews = []
    for (let i = 0; i < 40; i++) {
      const property = properties[i % properties.length]
      const daysAgo = Math.floor(Math.random() * 30)
      const createdAt = new Date()
      createdAt.setDate(createdAt.getDate() - daysAgo)
      
      propertyViews.push({
        propertyId: property.id,
        sessionId: 'session-' + Math.floor(Math.random() * 20),
        duration: Math.floor(Math.random() * 300) + 30,
        source: ['organic', 'direct', 'social', 'referral'][Math.floor(Math.random() * 4)],
        createdAt
      })
    }
    
    await prisma.propertyView.createMany({ data: propertyViews })
    results.propertyViews = propertyViews.length

    // Create user sessions
    const sessions = []
    for (let i = 0; i < 25; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const startedAt = new Date()
      startedAt.setDate(startedAt.getDate() - daysAgo)
      
      const duration = Math.floor(Math.random() * 1800) + 60
      const lastActivity = new Date(startedAt.getTime() + duration * 1000)
      
      sessions.push({
        sessionId: 'session-' + i,
        location: ['Tirana', 'Durres', 'Vlore', 'Unknown'][Math.floor(Math.random() * 4)],
        pageViews: Math.floor(Math.random() * 10) + 1,
        duration,
        referrer: ['https://google.com', 'https://facebook.com', 'direct', null][Math.floor(Math.random() * 4)],
        startedAt,
        lastActivity,
        isBot: false
      })
    }
    
    await prisma.userSession.createMany({ data: sessions })
    results.userSessions = sessions.length

    // Create search queries
    const queries = ['apartment tirana', 'house rent', 'villa sale', 'studio apartment', '2 bedroom']
    const searchQueries = []
    
    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const createdAt = new Date()
      createdAt.setDate(createdAt.getDate() - daysAgo)
      
      searchQueries.push({
        query: queries[Math.floor(Math.random() * queries.length)],
        results: Math.floor(Math.random() * 10) + 1,
        sessionId: 'session-' + Math.floor(Math.random() * 20),
        createdAt
      })
    }
    
    await prisma.searchQuery.createMany({ data: searchQueries })
    results.searchQueries = searchQueries.length

    // Create analytics events
    const eventTypes = ['PAGE_VIEW', 'PROPERTY_VIEW', 'SEARCH', 'CONTACT_CLICK', 'PHONE_CLICK'] as const
    const events = []
    
    for (let i = 0; i < 100; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const createdAt = new Date()
      createdAt.setDate(createdAt.getDate() - daysAgo)
      
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const property = properties[i % properties.length]
      
      events.push({
        type: eventType,
        category: 'User Interaction',
        action: eventType.replace('_', ' '),
        propertyId: Math.random() > 0.5 ? property.id : null,
        sessionId: 'session-' + Math.floor(Math.random() * 20),
        createdAt
      })
    }
    
    await prisma.analyticsEvent.createMany({ data: events })
    results.analyticsEvents = events.length

    console.log('Analytics seeding completed:', results)

    return NextResponse.json({
      success: true,
      message: "Analytics data seeded successfully",
      results
    })

  } catch (error) {
    console.error("Analytics seeding error:", error)
    return NextResponse.json(
      { error: "Failed to seed analytics data", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}