"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Users,
  Search,
  Eye,
  Phone,
  Mail,
  Home,
  DollarSign,
  Plus
} from "lucide-react"

interface TenantManagementProps {
  tenants: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: Date | null
    employer: string | null
    monthlyIncome: number | null
    emergencyContact: string | null
    emergencyPhone: string | null
    notes: string | null
    createdAt: Date
    leases: Array<{
      id: string
      startDate: Date
      endDate: Date
      monthlyRent: number
      status: string
      property: {
        id: string
        title: string
        address: string
        city: string
        state: string
      }
      payments: Array<{
        id: string
        amount: number
        dueDate: Date
        paidDate: Date | null
        status: string
      }>
    }>
  }>
}

export function TenantManagement({ tenants }: TenantManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTenants = tenants.filter(tenant =>
    `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm)
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const formatPhone = (phone: string) => {
    // Simple phone formatting
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'OVERDUE':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getLeaseStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'TERMINATED':
        return 'destructive'
      case 'EXPIRED':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const stats = {
    totalTenants: tenants.length,
    activeLeases: tenants.reduce((count, tenant) => 
      count + tenant.leases.filter(lease => lease.status === 'ACTIVE').length, 0
    ),
    totalMonthlyRent: tenants.reduce((total, tenant) =>
      total + tenant.leases
        .filter(lease => lease.status === 'ACTIVE')
        .reduce((sum, lease) => sum + lease.monthlyRent, 0), 0
    )
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/admin/rentals" className="flex items-center space-x-2 mr-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Rental Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span className="font-bold">Tenant Management</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTenants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLeases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalMonthlyRent)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button asChild>
            <Link href="/admin/rentals/tenants/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Link>
          </Button>
        </div>

        {/* Tenants Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Tenants ({filteredTenants.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Current Property</TableHead>
                    <TableHead>Lease Status</TableHead>
                    <TableHead>Monthly Rent</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => {
                    const activeLease = tenant.leases.find(lease => lease.status === 'ACTIVE')
                    const currentPayment = activeLease?.payments[0]
                    
                    return (
                      <TableRow key={tenant.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {tenant.firstName} {tenant.lastName}
                            </p>
                            {tenant.employer && (
                              <p className="text-sm text-muted-foreground">
                                {tenant.employer}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="text-sm">{tenant.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{formatPhone(tenant.phone)}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {activeLease ? (
                            <div>
                              <p className="font-medium">{activeLease.property.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {activeLease.property.city}, {activeLease.property.state}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No active lease</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {activeLease ? (
                            <div>
                              <Badge variant={getLeaseStatusColor(activeLease.status)}>
                                {activeLease.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                Until {formatDate(activeLease.endDate)}
                              </p>
                            </div>
                          ) : (
                            <Badge variant="outline">No lease</Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {activeLease ? (
                            <p className="font-medium">{formatCurrency(activeLease.monthlyRent)}</p>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {currentPayment ? (
                            <div>
                              <Badge variant={getPaymentStatusColor(currentPayment.status)}>
                                {currentPayment.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                Due: {formatDate(currentPayment.dueDate)}
                              </p>
                            </div>
                          ) : activeLease ? (
                            <Badge variant="outline">No payment due</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/rentals/tenants/${tenant.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {filteredTenants.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  {searchTerm ? "No tenants found matching your search" : "No tenants found"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}