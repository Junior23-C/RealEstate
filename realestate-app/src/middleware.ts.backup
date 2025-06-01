import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow access to admin routes only for ADMIN role
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
  matcher: ["/admin/:path*"]
}