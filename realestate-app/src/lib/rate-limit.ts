import { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

// In-memory store for rate limiting (development only)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries periodically (development only)
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 60000) // Clean up every minute
}

export interface RateLimitConfig {
  requests: number
  window: number // in seconds
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

// Production-ready rate limiting with Redis fallback to in-memory
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { requests: 10, window: 60 }
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowMs = config.window * 1000
  const resetTime = now + windowMs

  // Use Redis in production, fallback to in-memory for development
  if (process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL) {
    return rateLimitWithRedis(identifier, config, now, windowMs, resetTime)
  } else {
    return rateLimitInMemory(identifier, config, now, windowMs, resetTime)
  }
}

// Redis-based rate limiting for production
async function rateLimitWithRedis(
  identifier: string,
  config: RateLimitConfig,
  now: number,
  windowMs: number,
  resetTime: number
): Promise<RateLimitResult> {
  try {
    const key = `rate_limit:${identifier}`
    
    // Get current data
    const current = await kv.get<{ count: number; resetTime: number }>(key)
    
    if (!current || now > current.resetTime) {
      // First request or window expired
      const newData = { count: 1, resetTime }
      await kv.set(key, newData, { ex: Math.ceil(windowMs / 1000) })
      
      return {
        success: true,
        remaining: config.requests - 1,
        resetTime
      }
    }

    if (current.count >= config.requests) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    // Increment count
    const updatedData = { 
      count: current.count + 1, 
      resetTime: current.resetTime 
    }
    
    // Calculate TTL based on remaining window time
    const ttl = Math.ceil((current.resetTime - now) / 1000)
    await kv.set(key, updatedData, { ex: Math.max(1, ttl) })

    return {
      success: true,
      remaining: config.requests - updatedData.count,
      resetTime: current.resetTime
    }
  } catch (error) {
    console.error('Redis rate limiting error, falling back to in-memory:', error)
    return rateLimitInMemory(identifier, config, now, windowMs, resetTime)
  }
}

// In-memory rate limiting (development fallback)
function rateLimitInMemory(
  identifier: string,
  config: RateLimitConfig,
  now: number,
  windowMs: number,
  resetTime: number
): RateLimitResult {
  const current = rateLimitMap.get(identifier)

  if (!current || now > current.resetTime) {
    // First request or window expired
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return {
      success: true,
      remaining: config.requests - 1,
      resetTime
    }
  }

  if (current.count >= config.requests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: current.resetTime
    }
  }

  // Increment count
  current.count++
  rateLimitMap.set(identifier, current)

  return {
    success: true,
    remaining: config.requests - current.count,
    resetTime: current.resetTime
  }
}

export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (for production behind proxies)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown'
  
  return ip.trim()
}

// Specific rate limiting presets
export const RATE_LIMITS = {
  LOGIN: { requests: 5, window: 300 }, // 5 attempts per 5 minutes
  API_GENERAL: { requests: 100, window: 60 }, // 100 requests per minute
  UPLOAD: { requests: 10, window: 300 }, // 10 uploads per 5 minutes
  SUPER_ADMIN: { requests: 3, window: 3600 }, // 3 attempts per hour
  PASSWORD_RESET: { requests: 3, window: 3600 } // 3 resets per hour
}