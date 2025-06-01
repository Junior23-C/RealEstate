"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Home, LogOut, Plus, Eye, Mail, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

interface AdminDashboardProps {
  stats: {
    totalProperties: number
    totalInquiries: number
    forRent: number
    forSale: number
  }
  recentInquiries: Array<{
    id: string
    name: string
    createdAt: Date
    property: {
      title: string
    }
  }>
}

export function AdminDashboard({ stats, recentInquiries }: AdminDashboardProps) {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">Admin Dashboard</span>
            <span className="font-bold sm:hidden">Admin</span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              Welcome, {session?.user?.name || session?.user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
            <Button asChild>
              <Link href="/admin/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Property</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.forRent} for rent, {stats.forSale} for sale
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInquiries}</div>
                <p className="text-xs text-muted-foreground">
                  From interested clients
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">For Rent</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.forRent}</div>
                <p className="text-xs text-muted-foreground">
                  Available rental properties
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">For Sale</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.forSale}</div>
                <p className="text-xs text-muted-foreground">
                  Properties on sale
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>Manage your property listings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/admin/properties">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Properties
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/properties/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Management</CardTitle>
                <CardDescription>Track leases, payments, and tenants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/admin/rentals">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Rental Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/rentals/tenants">
                    <Eye className="h-4 w-4 mr-2" />
                    Manage Tenants
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
                <CardDescription>Latest messages from potential clients</CardDescription>
              </CardHeader>
              <CardContent>
                {recentInquiries.length > 0 ? (
                  <div className="space-y-3">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="text-sm">
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="text-muted-foreground">
                          Re: {inquiry.property.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link href="/admin/inquiries">View All Inquiries</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No inquiries yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                <Button asChild variant="outline">
                  <Link href="https://aliaj-re.com" target="_blank">View Website</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/properties">Properties</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/rentals">Rentals</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/inquiries">Inquiries</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/settings">Settings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}