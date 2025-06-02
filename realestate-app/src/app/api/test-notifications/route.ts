import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notificationService } from '@/lib/notifications'

export async function POST() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🧪 Testing notification services...')
    
    // Test all notification services
    await notificationService.testNotifications()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test notifications sent! Check your configured channels.' 
    })
  } catch (error) {
    console.error('Error testing notifications:', error)
    return NextResponse.json(
      { error: 'Failed to test notifications' },
      { status: 500 }
    )
  }
}