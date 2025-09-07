import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { generateNonce, getCSPWithNonce } from "./lib/security/csp-nonce"
import { SecureLogger } from "./lib/logger"

// Cache subdomain check result
const isAdminSubdomain = (hostname: string) => {
  return hostname.startsWith("admin.")
}

// Validate production domain to prevent subdomain takeover attacks
const isValidProductionDomain = (hostname: string): boolean => {
  const allowedDomains = [
    'aliaj-re.com',
    'www.aliaj-re.com', 
    'admin.aliaj-re.com'
  ]
  
  // Exact match for allowed domains
  if (allowedDomains.includes(hostname)) {
    return true
  }
  
  // Check for valid subdomain pattern
  if (hostname.endsWith('.aliaj-re.com')) {
    const subdomain = hostname.replace('.aliaj-re.com', '')
    // Only allow specific subdomains (prevent wildcard subdomain takeover)
    return ['admin', 'www'].includes(subdomain)
  }
  
  // Allow localhost and Vercel preview URLs for development
  return hostname.includes('localhost') || 
         hostname.includes('vercel.app') || 
         hostname.includes('127.0.0.1')
}

export default withAuth(
  function middleware(req) {
    const startTime = Date.now()
    const hostname = req.headers.get("host") || ""
    const pathname = req.nextUrl.pathname
    const method = req.method
    const userAgent = req.headers.get("user-agent") || ""
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    
    // Log all requests for security monitoring
    SecureLogger.logRequest(method, pathname, {
      ip,
      hostname,
      userAgent: userAgent.substring(0, 200), // Limit length
    })

    // Log suspicious domain access attempts
    if (process.env.NODE_ENV === 'production' && !isValidProductionDomain(hostname)) {
      SecureLogger.logSecurityEvent("Invalid domain access attempt", {
        ip,
        hostname,
        pathname,
        method,
        userAgent: userAgent.substring(0, 100)
      })
    }
    
    // Skip middleware for API routes and static assets (double check)
    if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
      return NextResponse.next()
    }
    
    const isAdmin = isAdminSubdomain(hostname)
    
    // Handle subdomain routing
    if (isAdmin) {
      // Fast path: Already on admin route
      if (pathname.startsWith("/admin")) {
        return NextResponse.next()
      }
      
      // Allow property detail pages on admin subdomain
      if (pathname.startsWith("/properties/")) {
        return NextResponse.next()
      }
      
      // Redirect root to admin dashboard
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      
      // Rewrite other paths to admin
      const url = req.nextUrl.clone()
      url.pathname = "/admin" + pathname
      return NextResponse.rewrite(url)
    } else {
      // On main domain - redirect admin routes to admin subdomain (only in production)
      if (pathname.startsWith("/admin") && isValidProductionDomain(hostname)) {
        // Log potential subdomain bypass attempt
        if (!hostname.startsWith("admin.")) {
          SecureLogger.logSecurityEvent("Admin access from main domain", {
            ip,
            hostname,
            pathname
          })
        }
        
        const adminUrl = new URL(pathname, `https://admin.aliaj-re.com`)
        adminUrl.search = req.nextUrl.search
        return NextResponse.redirect(adminUrl, 308) // Permanent redirect for caching
      }
    }
    
    // Admin role protection - only check when needed
    if (pathname.startsWith("/admin") && 
        pathname !== "/admin/login" &&
        req.nextauth.token?.role !== "ADMIN") {
      
      // Log unauthorized access attempt
      SecureLogger.logSecurityEvent("Unauthorized admin access attempt", {
        ip,
        pathname,
        userRole: req.nextauth.token?.role || 'none',
        hasToken: !!req.nextauth.token
      })
      
      return NextResponse.rewrite(new URL("/admin/login", req.url))
    }
    
    // Add security headers
    const response = NextResponse.next()
    
    // Generate CSP nonce for inline scripts
    const nonce = generateNonce()
    const cspHeader = getCSPWithNonce(nonce)
    
    response.headers.set('Content-Security-Policy', cspHeader)
    response.headers.set('X-CSP-Nonce', nonce) // Pass nonce to pages via header
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-DNS-Prefetch-Control', 'off')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // HSTS for production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        
        // Fast paths
        if (pathname === "/admin/login") return true
        if (!pathname.startsWith("/admin")) return true
        
        // Only check token for admin routes
        return !!token
      }
    }
  }
)

// Optimize matcher to be more specific
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)',
  ]
}