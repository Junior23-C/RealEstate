"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Mail,
  Calendar,
  Building,
  DollarSign,
  Edit,
  Home,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface TenantDetailProps {
  tenant: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: Date | null
    ssn: string | null
    emergencyContact: string | null
    emergencyPhone: string | null
    employer: string | null
    monthlyIncome: number | null
    notes: string | null
    createdAt: Date
    leases: Array<{
      id: string
      startDate: Date
      endDate: Date
      monthlyRent: number
      securityDeposit: number | null
      status: string
      property: {
        id: string
        title: string
        address: string
        city: string
        state: string
        images: Array<{
          url: string
          alt?: string | null
        }>
      }
      payments: Array<{
        id: string
        amount: number
        dueDate: Date
        paidDate: Date | null
        status: string
        paymentMethod: string | null
      }>
    }>
  }
}

export function TenantDetail({ tenant }: TenantDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'leases' | 'payments'>('overview')

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

  const activeLease = tenant.leases.find(lease => lease.status === 'ACTIVE')
  const allPayments = tenant.leases.flatMap(lease => 
    lease.payments.map(payment => ({
      ...payment,
      lease
    }))
  ).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())

  const paymentStats = {
    total: allPayments.length,
    paid: allPayments.filter(p => p.status === 'PAID').length,
    pending: allPayments.filter(p => p.status === 'PENDING').length,
    overdue: allPayments.filter(p => p.status === 'OVERDUE').length,
    totalPaid: allPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0)
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/admin/rentals/tenants" className="flex items-center space-x-2 mr-6">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tenants</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span className="font-bold">{tenant.firstName} {tenant.lastName}</span>
            </div>
          </div>
          <Button asChild>
            <Link href={`/admin/rentals/tenants/${tenant.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Tenant
            </Link>
          </Button>
        </div>
      </header>

      <div className="container py-8">
        {/* Tenant Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{tenant.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{formatPhone(tenant.phone)}</p>
              </div>
              {tenant.dateOfBirth && (
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{formatDate(tenant.dateOfBirth)}</p>
                </div>
              )}
              {tenant.emergencyContact && (
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{tenant.emergencyContact}</p>
                  {tenant.emergencyPhone && (
                    <p className="text-sm text-muted-foreground">{formatPhone(tenant.emergencyPhone)}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Employment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tenant.employer ? (
                <div>
                  <p className="text-sm text-muted-foreground">Employer</p>
                  <p className="font-medium">{tenant.employer}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No employer information</p>
              )}
              {tenant.monthlyIncome && (
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p className="font-medium">{formatCurrency(tenant.monthlyIncome)}</p>
                </div>
              )}
              {tenant.ssn && (
                <div>
                  <p className="text-sm text-muted-foreground">SSN (Last 4)</p>
                  <p className="font-medium">****{tenant.ssn}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeLease ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Property</p>
                    <p className="font-medium">{activeLease.property.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activeLease.property.city}, {activeLease.property.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="font-medium">{formatCurrency(activeLease.monthlyRent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lease Ends</p>
                    <p className="font-medium">{formatDate(activeLease.endDate)}</p>
                  </div>
                  <Badge variant={getLeaseStatusColor(activeLease.status)}>
                    {activeLease.status}
                  </Badge>
                </>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No active lease</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{paymentStats.paid}</p>
                  <p className="text-sm text-muted-foreground">Payments Made</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(paymentStats.totalPaid)}</p>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{paymentStats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{paymentStats.overdue}</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'leases' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('leases')}
          >
            Leases ({tenant.leases.length})
          </Button>
          <Button
            variant={activeTab === 'payments' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('payments')}
          >
            Payment History ({allPayments.length})
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {tenant.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{tenant.notes}</p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Tenant Since</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{formatDate(tenant.createdAt)}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'leases' && (
          <Card>
            <CardHeader>
              <CardTitle>Lease History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Lease Period</TableHead>
                      <TableHead>Monthly Rent</TableHead>
                      <TableHead>Security Deposit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenant.leases.map((lease) => {
                      const primaryImage = lease.property.images[0]
                      return (
                        <TableRow key={lease.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {primaryImage ? (
                                <div className="relative h-12 w-16 rounded overflow-hidden">
                                  <Image
                                    src={primaryImage.url}
                                    alt={lease.property.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-12 w-16 bg-muted rounded flex items-center justify-center">
                                  <Home className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{lease.property.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {lease.property.city}, {lease.property.state}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{formatDate(lease.startDate)} - {formatDate(lease.endDate)}</p>
                              <p className="text-sm text-muted-foreground">
                                {Math.ceil((new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(lease.monthlyRent)}
                          </TableCell>
                          <TableCell>
                            {lease.securityDeposit ? formatCurrency(lease.securityDeposit) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getLeaseStatusColor(lease.status)}>
                              {lease.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/rentals/leases/${lease.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                {tenant.leases.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No leases found for this tenant
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.dueDate)}</TableCell>
                        <TableCell>{payment.lease.property.title}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                        </TableCell>
                        <TableCell>
                          {payment.paymentMethod || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {allPayments.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No payment history found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}