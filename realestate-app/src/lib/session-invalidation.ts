// Session invalidation utility for JWT tokens
// Since NextAuth.js uses JWTs, we need to track invalidated sessions

import { kv } from '@vercel/kv'

// In-memory store for development
const invalidatedSessions = new Set<string>()

export interface SessionInvalidationData {
  userId: string
  invalidatedAt: number
  reason: 'password_change' | 'admin_action' | 'security_breach'
}

// Invalidate all sessions for a user
export async function invalidateUserSessions(userId: string, reason: SessionInvalidationData['reason']): Promise<void> {
  const invalidationData: SessionInvalidationData = {
    userId,
    invalidatedAt: Date.now(),
    reason
  }
  
  const key = `session_invalidation:${userId}`
  
  if (process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL) {
    // Use Redis in production
    try {
      await kv.set(key, invalidationData, { ex: 86400 * 30 }) // 30 days TTL
    } catch (error) {
      console.error('Failed to invalidate sessions in Redis:', error)
      // Fallback to in-memory
      invalidatedSessions.add(`${userId}:${invalidationData.invalidatedAt}`)
    }
  } else {
    // Use in-memory store for development
    invalidatedSessions.add(`${userId}:${invalidationData.invalidatedAt}`)
  }
}

// Check if a session is invalidated
export async function isSessionInvalidated(userId: string, tokenIat: number): Promise<boolean> {
  const key = `session_invalidation:${userId}`
  
  if (process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL) {
    try {
      const invalidationData = await kv.get<SessionInvalidationData>(key)
      
      if (invalidationData && tokenIat < invalidationData.invalidatedAt / 1000) {
        return true
      }
    } catch (error) {
      console.error('Failed to check session invalidation in Redis:', error)
      // Fallback to checking in-memory
      return checkInMemoryInvalidation(userId, tokenIat)
    }
  } else {
    return checkInMemoryInvalidation(userId, tokenIat)
  }
  
  return false
}

// Check in-memory invalidation (development fallback)
function checkInMemoryInvalidation(userId: string, tokenIat: number): boolean {
  for (const entry of invalidatedSessions) {
    const [entryUserId, invalidatedAtStr] = entry.split(':')
    const invalidatedAt = parseInt(invalidatedAtStr)
    
    if (entryUserId === userId && tokenIat < invalidatedAt / 1000) {
      return true
    }
  }
  return false
}

// Clear expired invalidations (cleanup job)
export async function cleanupExpiredInvalidations(): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    const now = Date.now()
    const expiredThreshold = now - (86400 * 30 * 1000) // 30 days
    
    for (const entry of invalidatedSessions) {
      const invalidatedAt = parseInt(entry.split(':')[1])
      if (invalidatedAt < expiredThreshold) {
        invalidatedSessions.delete(entry)
      }
    }
  }
}

// Run cleanup every hour in development
if (process.env.NODE_ENV === 'development') {
  setInterval(cleanupExpiredInvalidations, 3600000) // 1 hour
}