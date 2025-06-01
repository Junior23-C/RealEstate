import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const hostname = req.headers.get("host") || ""
    const isAdminSubdomain = hostname.startsWith("admin.")
    
    // Handle subdomain routing
    if (isAdminSubdomain) {
      // On admin subdomain - ensure we're on admin routes
      if (!req.nextUrl.pathname.startsWith("/admin")) {
        const url = req.nextUrl.clone()
        url.pathname = "/admin" + (req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname)
        return NextResponse.rewrite(url)
      }
    } else {
      // On main domain - redirect admin routes to admin subdomain (only in production)
      if (req.nextUrl.pathname.startsWith("/admin") && hostname.includes("aliaj-re.com")) {
        const adminUrl = new URL(req.nextUrl.pathname, `https://admin.aliaj-re.com`)
        adminUrl.search = req.nextUrl.search
        return NextResponse.redirect(adminUrl)
      }
    }
    
    // Existing admin role protection (preserve original logic)
    if (req.nextUrl.pathname.startsWith("/admin") && 
        req.nextUrl.pathname !== "/admin/login" &&
        req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/admin/login", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page
        if (req.nextUrl.pathname === "/admin/login") {
          return true
        }
        // Require authentication for admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }
        return true
      }
    }
  }
)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)"]
}