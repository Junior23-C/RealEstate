import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Cache subdomain check result
const isAdminSubdomain = (hostname: string) => {
  return hostname.startsWith("admin.")
}

export default withAuth(
  function middleware(req) {
    const hostname = req.headers.get("host") || ""
    const pathname = req.nextUrl.pathname
    
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
      if (pathname.startsWith("/admin") && hostname.includes("aliaj-re.com")) {
        const adminUrl = new URL(pathname, `https://admin.aliaj-re.com`)
        adminUrl.search = req.nextUrl.search
        return NextResponse.redirect(adminUrl, 308) // Permanent redirect for caching
      }
    }
    
    // Admin role protection - only check when needed
    if (pathname.startsWith("/admin") && 
        pathname !== "/admin/login" &&
        req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/admin/login", req.url))
    }
    
    // Add security headers
    const response = NextResponse.next()
    
    // Content Security Policy
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https://images.unsplash.com https://*.vercel-insights.com;
      font-src 'self' https://fonts.gstatic.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
    
    response.headers.set('Content-Security-Policy', cspHeader)
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