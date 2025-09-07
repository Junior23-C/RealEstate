import { NextRequest, NextResponse } from "next/server"
import { AnalyticsTracker } from "@/lib/analytics"
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for analytics to prevent spam
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`analytics_track:${clientId}`, {
      windowMs: 60 * 1000, // 1 minute
      maxAttempts: 100 // 100 events per minute
    })
    
    if (!rateLimitResult.success) {
      return NextResponse.json({
        error: "Rate limit exceeded"
      }, { status: 429 })
    }

    const body = await request.json()
    const { eventType, ...data } = body

    switch (eventType) {
      case 'PAGE_VIEW':
        await AnalyticsTracker.trackPageView(data.path, data.title)
        break
        
      case 'PROPERTY_VIEW':
        await AnalyticsTracker.trackPropertyView(data.propertyId, data.duration)
        break
        
      case 'SEARCH':
        await AnalyticsTracker.trackSearch(data.query, data.filters, data.results)
        break
        
      case 'INQUIRY_SUBMIT':
        await AnalyticsTracker.trackInquirySubmit(data.inquiryId, data.propertyId)
        break
        
      case 'CONTACT_CLICK':
      case 'PHONE_CLICK':
      case 'EMAIL_CLICK':
      case 'WHATSAPP_CLICK':
      case 'IMAGE_VIEW':
      case 'DOWNLOAD':
      case 'SHARE':
      case 'FAVORITE':
        await AnalyticsTracker.trackEvent({
          type: eventType as any,
          category: data.category || 'User Interaction',
          action: data.action || eventType.replace('_', ' '),
          label: data.label,
          value: data.value,
          propertyId: data.propertyId,
          inquiryId: data.inquiryId,
          metadata: data.metadata
        })
        break
        
      default:
        return NextResponse.json({
          error: "Invalid event type"
        }, { status: 400 })
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json({
      error: "Failed to track event"
    }, { status: 500 })
  }
}