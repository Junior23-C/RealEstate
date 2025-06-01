import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check if tables exist
    const propertyCount = await prisma.property.count()
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      tables: {
        properties: propertyCount,
        users: userCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}