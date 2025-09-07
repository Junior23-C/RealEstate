import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notificationService } from "@/lib/notifications"
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`notifications:${clientId}`, RATE_LIMITS.API_GENERAL)
    
    if (!rateLimitResult.success) {
      return NextResponse.json({
        error: "Too many requests"
      }, { status: 429 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type')

    switch (type) {
      case 'count':
        const count = await notificationService.getUnreadCount()
        return NextResponse.json({ count })

      case 'recent':
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const notifications = await notificationService.getRecentNotifications(limit)
        return NextResponse.json({ notifications })

      default:
        const allNotifications = await notificationService.getRecentNotifications()
        const unreadCount = await notificationService.getUnreadCount()
        
        return NextResponse.json({
          notifications: allNotifications,
          unreadCount
        })
    }
  } catch (error) {
    console.error("Notifications API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`notifications-action:${clientId}`, RATE_LIMITS.API_GENERAL)
    
    if (!rateLimitResult.success) {
      return NextResponse.json({
        error: "Too many requests"
      }, { status: 429 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'mark_all_read':
        await notificationService.markAllAsRead()
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Notifications action error:", error)
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    )
  }
}