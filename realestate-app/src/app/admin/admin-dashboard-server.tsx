import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Home, LogOut, Plus, Eye, Mail, DollarSign, User } from "lucide-react"

interface AdminDashboardServerProps {
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
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function AdminDashboardServer({ stats, recentInquiries, user }: AdminDashboardServerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg">Admin Dashboard</span>
              <p className="text-xs text-muted-foreground">Property Management</p>
            </div>
            <span className="font-bold sm:hidden">Admin</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-semibold">
                  {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{user?.name || 'Admin'}</p>
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </div>
            </div>
            <form action="/api/auth/signout" method="POST">
              <Button type="submit" variant="outline" size="sm" className="hover:bg-destructive hover:text-destructive-foreground">
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your real estate portfolio
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="https://aliaj-re.com" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Site</span>
                <span className="sm:hidden">Site</span>
              </Link>
            </Button>
            <Button asChild className="shadow-lg">
              <Link href="/admin/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Property</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid - No animations */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Properties</CardTitle>
              <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg">
                <Home className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalProperties}</div>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                {stats.forRent} for rent • {stats.forSale} for sale
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Total Inquiries</CardTitle>
              <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.totalInquiries}</div>
              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                From interested clients
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">For Rent</CardTitle>
              <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg">
                <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.forRent}</div>
              <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                Available rentals
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">For Sale</CardTitle>
              <div className="p-2 bg-orange-200 dark:bg-orange-800 rounded-lg">
                <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.forSale}</div>
              <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                Properties for sale
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Property Management</CardTitle>
                  <CardDescription>Manage your property listings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
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

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Rental Management</CardTitle>
                  <CardDescription>Track leases, payments, and tenants</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
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

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                  <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recent Inquiries</CardTitle>
                  <CardDescription>Latest messages from potential clients</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recentInquiries.length > 0 ? (
                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-3 bg-muted/50 rounded-lg border">
                      <div className="font-medium text-sm">{inquiry.name}</div>
                      <div className="text-muted-foreground text-xs mt-1">
                        Re: {inquiry.property.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link href="/admin/inquiries">View All Inquiries</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No inquiries yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Links */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-xl">Quick Navigation</CardTitle>
            <CardDescription>Access all admin features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950">
                <Link href="https://aliaj-re.com" target="_blank">
                  <Eye className="h-5 w-5" />
                  <span className="text-xs">View Website</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950">
                <Link href="/admin/properties">
                  <Building2 className="h-5 w-5" />
                  <span className="text-xs">Properties</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950">
                <Link href="/admin/rentals">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-xs">Rentals</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-950">
                <Link href="/admin/inquiries">
                  <Mail className="h-5 w-5" />
                  <span className="text-xs">Inquiries</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800">
                <Link href="/admin/settings">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}