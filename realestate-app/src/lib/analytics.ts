import { prisma } from '@/lib/db'
import { headers } from 'next/headers'

interface TrackEventParams {
  type: 'PAGE_VIEW' | 'PROPERTY_VIEW' | 'INQUIRY_SUBMIT' | 'SEARCH' | 'CONTACT_CLICK' | 'PHONE_CLICK' | 'EMAIL_CLICK' | 'WHATSAPP_CLICK' | 'IMAGE_VIEW' | 'DOWNLOAD' | 'SHARE' | 'FAVORITE'
  category: string
  action: string
  label?: string
  value?: number
  propertyId?: string
  inquiryId?: string
  metadata?: Record<string, unknown>
}

interface SessionData {
  sessionId: string
  userAgent?: string
  ipAddress?: string
  referrer?: string
  location?: string
}

export class AnalyticsTracker {
  
  static async trackEvent({
    type,
    category,
    action,
    label,
    value,
    propertyId,
    inquiryId,
    metadata
  }: TrackEventParams): Promise<void> {
    try {
      const sessionData = await this.getSessionData()
      
      await prisma.analyticsEvent.create({
        data: {
          type,
          category,
          action,
          label,
          value,
          propertyId,
          inquiryId,
          sessionId: sessionData.sessionId,
          userAgent: sessionData.userAgent,
          ipAddress: sessionData.ipAddress,
          referrer: sessionData.referrer,
          metadata: metadata ? JSON.stringify(metadata) : null
        }
      })

      // Update or create user session
      await this.updateUserSession(sessionData)
      
    } catch (error) {
      console.error('Analytics tracking error:', error)
      // Don't throw error to avoid breaking user experience
    }
  }

  static async trackPageView(path: string, title?: string): Promise<void> {
    try {
      const sessionData = await this.getSessionData()
      
      await Promise.all([
        // Track in PageView table
        prisma.pageView.create({
          data: {
            path,
            title,
            sessionId: sessionData.sessionId,
            userAgent: sessionData.userAgent,
            ipAddress: sessionData.ipAddress,
            referrer: sessionData.referrer,
            location: sessionData.location
          }
        }),
        
        // Track as analytics event
        this.trackEvent({
          type: 'PAGE_VIEW',
          category: 'Navigation',
          action: 'Page View',
          label: path
        })
      ])
      
    } catch (error) {
      console.error('Page view tracking error:', error)
    }
  }

  static async trackPropertyView(propertyId: string, duration?: number): Promise<void> {
    try {
      const sessionData = await this.getSessionData()
      
      await Promise.all([
        // Track in PropertyView table
        prisma.propertyView.create({
          data: {
            propertyId,
            sessionId: sessionData.sessionId,
            userAgent: sessionData.userAgent,
            ipAddress: sessionData.ipAddress,
            referrer: sessionData.referrer,
            duration,
            location: sessionData.location,
            source: this.getTrafficSource(sessionData.referrer)
          }
        }),
        
        // Track as analytics event
        this.trackEvent({
          type: 'PROPERTY_VIEW',
          category: 'Property',
          action: 'View',
          propertyId,
          value: duration
        })
      ])
      
    } catch (error) {
      console.error('Property view tracking error:', error)
    }
  }

  static async trackSearch(query: string, filters?: Record<string, unknown>, results?: number): Promise<void> {
    try {
      const sessionData = await this.getSessionData()
      
      await Promise.all([
        // Track in SearchQuery table
        prisma.searchQuery.create({
          data: {
            query,
            filters: filters ? JSON.stringify(filters) : null,
            results: results || 0,
            sessionId: sessionData.sessionId,
            userAgent: sessionData.userAgent,
            ipAddress: sessionData.ipAddress,
            location: sessionData.location
          }
        }),
        
        // Track as analytics event
        this.trackEvent({
          type: 'SEARCH',
          category: 'Search',
          action: 'Query',
          label: query,
          value: results,
          metadata: filters
        })
      ])
      
    } catch (error) {
      console.error('Search tracking error:', error)
    }
  }

  static async trackInquirySubmit(inquiryId: string, propertyId: string): Promise<void> {
    try {
      await this.trackEvent({
        type: 'INQUIRY_SUBMIT',
        category: 'Engagement',
        action: 'Inquiry Submit',
        propertyId,
        inquiryId
      })
      
      // Create inquiry response record for tracking response time
      await prisma.inquiryResponse.create({
        data: {
          inquiryId
        }
      })
      
    } catch (error) {
      console.error('Inquiry submit tracking error:', error)
    }
  }

  static async trackInquiryResponse(inquiryId: string, respondedBy: string, method: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'IN_PERSON' | 'OTHER'): Promise<void> {
    try {
      // Get inquiry creation time for response time calculation
      const inquiry = await prisma.inquiry.findUnique({
        where: { id: inquiryId },
        select: { createdAt: true }
      })
      
      if (!inquiry) return

      const now = new Date()
      const responseTimeMinutes = Math.floor((now.getTime() - inquiry.createdAt.getTime()) / (1000 * 60))
      
      await prisma.inquiryResponse.upsert({
        where: { inquiryId },
        update: {
          respondedAt: now,
          responseTime: responseTimeMinutes,
          status: 'RESPONDED',
          respondedBy,
          method
        },
        create: {
          inquiryId,
          respondedAt: now,
          responseTime: responseTimeMinutes,
          status: 'RESPONDED',
          respondedBy,
          method
        }
      })
      
    } catch (error) {
      console.error('Inquiry response tracking error:', error)
    }
  }

  private static async getSessionData(): Promise<SessionData> {
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || undefined
    const referrer = headersList.get('referer') || undefined
    
    // Generate session ID based on IP + User Agent (simplified)
    const sessionId = this.generateSessionId(ipAddress, userAgent)
    
    return {
      sessionId,
      userAgent,
      ipAddress,
      referrer,
      location: await this.getLocationFromIP()
    }
  }

  private static generateSessionId(ipAddress?: string, userAgent?: string): string {
    const data = `${ipAddress || 'unknown'}-${userAgent || 'unknown'}-${new Date().toDateString()}`
    return Buffer.from(data).toString('base64').substring(0, 24)
  }

  private static async getLocationFromIP(): Promise<string | undefined> {
    // TODO: Implement IP geolocation (e.g., using MaxMind or similar service)
    // For now, return undefined
    return undefined
  }

  private static getTrafficSource(referrer?: string): string | undefined {
    if (!referrer) return 'direct'
    
    const url = new URL(referrer)
    const domain = url.hostname
    
    if (domain.includes('google')) return 'organic'
    if (domain.includes('facebook') || domain.includes('instagram')) return 'social'
    if (domain.includes('twitter') || domain.includes('linkedin')) return 'social'
    
    return 'referral'
  }

  private static async updateUserSession(sessionData: SessionData): Promise<void> {
    try {
      const now = new Date()
      
      await prisma.userSession.upsert({
        where: { sessionId: sessionData.sessionId },
        update: {
          lastActivity: now,
          pageViews: {
            increment: 1
          }
        },
        create: {
          sessionId: sessionData.sessionId,
          userAgent: sessionData.userAgent,
          ipAddress: sessionData.ipAddress,
          referrer: sessionData.referrer,
          location: sessionData.location,
          landingPage: sessionData.referrer,
          pageViews: 1,
          isBot: this.isBot(sessionData.userAgent),
          startedAt: now,
          lastActivity: now
        }
      })
      
    } catch (error) {
      console.error('Session update error:', error)
    }
  }

  private static isBot(userAgent?: string): boolean {
    if (!userAgent) return false
    
    const botPatterns = [
      'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
      'yandexbot', 'facebookexternalhit', 'twitterbot', 'rogerbot',
      'linkedinbot', 'embedly', 'quora link preview', 'showyoubot',
      'outbrain', 'pinterest/0.', 'developers.google.com/+/web/snippet',
      'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot',
      'whatsapp', 'flipboard', 'tumblr', 'bitlybot', 'skypeuripreview',
      'nuzzel', 'discordbot', 'telegrambot', 'crawler', 'spider', 'bot'
    ]
    
    return botPatterns.some(pattern => 
      userAgent.toLowerCase().includes(pattern)
    )
  }

  // Public API for client-side tracking
  static getClientTrackingScript(): string {
    return `
      window.analyticsTracker = {
        track: function(eventType, data) {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventType, ...data })
          }).catch(console.error);
        },
        trackPropertyView: function(propertyId, duration) {
          this.track('PROPERTY_VIEW', { propertyId, duration });
        },
        trackContactClick: function(type, propertyId) {
          this.track(type.toUpperCase() + '_CLICK', { propertyId });
        }
      };
    `
  }
}