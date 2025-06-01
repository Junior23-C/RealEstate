"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Building2, Phone, User } from "lucide-react"
import { useEffect, useState } from "react"

interface NavbarProps {
  companyName?: string
}

export function Navbar({ companyName = "Aliaj Real Estate" }: NavbarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      setIsAdminSubdomain(hostname.startsWith("admin."))
    }
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/contact", label: "Contact", icon: Phone },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Aliaj Real Estate - Home">
          <Building2 className="h-6 w-6" aria-hidden="true" />
          <span className="hidden font-bold sm:inline-block">
            {companyName}
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-between space-x-2">
          <nav className="flex items-center space-x-6" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Only show admin buttons on admin subdomain or localhost */}
            {(isAdminSubdomain || (typeof window !== 'undefined' && window.location.hostname === "localhost")) && (
              <>
                {session?.user?.role === "ADMIN" ? (
                  <Button variant="default" size="sm" asChild>
                    <Link href="/admin">
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/login">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Admin Login</span>
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}