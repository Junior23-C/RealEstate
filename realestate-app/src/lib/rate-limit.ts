import { NextRequest } from 'next/server'

// In-memory store for rate limiting (for development/small scale)
// In production, you'd want to use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60000) // Clean up every minute

export interface RateLimitConfig {
  requests: number
  window: number // in seconds
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { requests: 10, window: 60 }
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.window * 1000
  const resetTime = now + windowMs

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