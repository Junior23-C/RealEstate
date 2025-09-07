"use client"

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface AnalyticsTrackerProps {
  propertyId?: string
}

declare global {
  interface Window {
    analyticsTracker: {
      track: (eventType: string, data: Record<string, unknown>) => void
      trackPropertyView: (propertyId: string, duration?: number) => void
      trackContactClick: (type: string, propertyId?: string) => void
    }
  }
}

function AnalyticsTrackerInner({ propertyId }: AnalyticsTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize analytics tracker
    if (typeof window !== 'undefined' && !window.analyticsTracker) {
      window.analyticsTracker = {
        track: function(eventType: string, data: Record<string, unknown>) {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventType, ...data })
          }).catch(console.error)
        },
        trackPropertyView: function(propertyId: string, duration?: number) {
          this.track('PROPERTY_VIEW', { propertyId, duration })
        },
        trackContactClick: function(type: string, propertyId?: string) {
          this.track(type.toUpperCase() + '_CLICK', { propertyId })
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.analyticsTracker) {
      // Track page view
      const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      window.analyticsTracker.track('PAGE_VIEW', { 
        path,
        title: document.title 
      })
    }
  }, [pathname, searchParams])

  useEffect(() => {
    if (propertyId && typeof window !== 'undefined' && window.analyticsTracker) {
      // Track property view
      const startTime = Date.now()
      window.analyticsTracker.trackPropertyView(propertyId)

      // Track time spent on property page
      const trackViewDuration = () => {
        const duration = Math.round((Date.now() - startTime) / 1000) // Duration in seconds
        if (duration > 5) { // Only track if user stayed more than 5 seconds
          window.analyticsTracker.track('PROPERTY_VIEW', { 
            propertyId, 
            duration 
          })
        }
      }

      // Track when user leaves the page
      window.addEventListener('beforeunload', trackViewDuration)
      
      return () => {
        window.removeEventListener('beforeunload', trackViewDuration)
      }
    }
  }, [propertyId])

  return null // This component doesn't render anything
}

export function AnalyticsTracker({ propertyId }: AnalyticsTrackerProps) {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner propertyId={propertyId} />
    </Suspense>
  )
}

// Hook for tracking events from components
export function useAnalytics() {
  const trackEvent = (eventType: string, data: Record<string, unknown> = {}) => {
    if (typeof window !== 'undefined' && window.analyticsTracker) {
      window.analyticsTracker.track(eventType, data)
    }
  }

  const trackContactClick = (type: 'phone' | 'email' | 'whatsapp', propertyId?: string) => {
    trackEvent(type.toUpperCase() + '_CLICK', { propertyId })
  }

  const trackSearch = (query: string, filters: Record<string, unknown> = {}, results = 0) => {
    trackEvent('SEARCH', { query, filters, results })
  }

  const trackInquirySubmit = (inquiryId: string, propertyId: string) => {
    trackEvent('INQUIRY_SUBMIT', { inquiryId, propertyId })
  }

  const trackPropertyFavorite = (propertyId: string) => {
    trackEvent('FAVORITE', { propertyId })
  }

  const trackPropertyShare = (propertyId: string, platform?: string) => {
    trackEvent('SHARE', { propertyId, platform })
  }

  const trackImageView = (propertyId: string, imageIndex: number) => {
    trackEvent('IMAGE_VIEW', { propertyId, imageIndex })
  }

  return {
    trackEvent,
    trackContactClick,
    trackSearch,
    trackInquirySubmit,
    trackPropertyFavorite,
    trackPropertyShare,
    trackImageView
  }
}