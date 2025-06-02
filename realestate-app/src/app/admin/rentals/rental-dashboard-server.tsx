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
  Home,
  DollarSign,
  Calendar,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  Eye,
  Plus
} from "lucide-react"

interface RentalDashboardServerProps {
  stats: {
    totalLeases: number
    activeLeases: number
    expiringSoon: number
    overduePayments: number
    rentedProperties: number
    availableProperties: number
    totalMonthlyRent: number
  }
  activeLeases: Array<{
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
      images: Array<{
        url: string
        alt?: string | null
      }>
    }
    tenant: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
    }
    payments: Array<{
      id: string
      amount: number
      dueDate: Date
      paidDate: Date | null
      status: string
    }>
  }>
  recentPayments: Array<{
    id: string
    amount: number
    paidDate: Date | null
    paymentMethod: string | null
    lease: {
      property: {
        title: string
      }
      tenant: {
        firstName: string
        lastName: string
      }
    }
  }>
  upcomingPayments: Array<{
    id: string
    amount: number
    dueDate: Date
    status: string
    lease: {
      property: {
        title: string
      }
      tenant: {
        firstName: string
        lastName: string
      }
    }
  }>
}

export function RentalDashboardServer({ 
  stats, 
  activeLeases, 
  recentPayments, 
  upcomingPayments 
}: RentalDashboardServerProps) {
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'LATE':
        return 'destructive'
      case 'PARTIAL':
        return 'secondary'
      case 'CANCELLED':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center space-x-2 mr-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold">Rental Management</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLeases}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalLeases} total leases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalMonthlyRent)}</div>
              <p className="text-xs text-muted-foreground">
                From {stats.rentedProperties} rented properties
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">
                Leases ending in 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overduePayments}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.slice(0, 5).map((payment) => {
                  if (!payment.lease) return null
                  
                  return (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {payment.lease.tenant?.firstName || 'Unknown'} {payment.lease.tenant?.lastName || 'Tenant'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.lease.property?.title || 'Unknown Property'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.paidDate && formatDate(payment.paidDate)}
                        </p>
                      </div>
                    </div>
                  )
                }).filter(Boolean)}
                {recentPayments.filter(p => p.lease != null).length === 0 && (
                  <p className="text-muted-foreground">No recent payments</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Upcoming Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayments.slice(0, 5).map((payment) => {
                  if (!payment.lease) return null
                  
                  const daysUntil = getDaysUntilDue(payment.dueDate)
                  return (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {payment.lease.tenant?.firstName || 'Unknown'} {payment.lease.tenant?.lastName || 'Tenant'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.lease.property?.title || 'Unknown Property'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className={`text-sm ${
                          daysUntil <= 3 ? 'text-red-600' : 
                          daysUntil <= 7 ? 'text-orange-600' : 'text-muted-foreground'
                        }`}>
                          {daysUntil === 0 ? 'Due today' : 
                           daysUntil === 1 ? 'Due tomorrow' :
                           daysUntil > 0 ? `Due in ${daysUntil} days` :
                           `${Math.abs(daysUntil)} days overdue`}
                        </p>
                      </div>
                    </div>
                  )
                }).filter(Boolean)}
                {upcomingPayments.filter(p => p.lease != null).length === 0 && (
                  <p className="text-muted-foreground">No upcoming payments</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Leases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Leases</CardTitle>
            <Button asChild>
              <Link href="/admin/rentals/leases/new">
                <Plus className="h-4 w-4 mr-2" />
                New Lease
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Lease Period</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeLeases.map((lease) => {
                    if (!lease.property || !lease.tenant) return null
                    
                    const primaryImage = lease.property.images?.[0]
                    const currentPayment = lease.payments?.[0]
                    
                    return (
                      <TableRow key={lease.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {primaryImage ? (
                              <div className="relative h-12 w-16 rounded overflow-hidden">
                                <Image
                                  src={primaryImage.url}
                                  alt={lease.property.title || 'Property'}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-16 bg-muted rounded flex items-center justify-center">
                                <Home className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{lease.property.title || 'Unknown Property'}</p>
                              <p className="text-sm text-muted-foreground">
                                {lease.property.city || 'Unknown'}, {lease.property.state || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {lease.tenant.firstName || 'Unknown'} {lease.tenant.lastName || 'Tenant'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lease.tenant.email || 'No email'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatCurrency(lease.monthlyRent || 0)}</p>
                          <p className="text-sm text-muted-foreground">per month</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {Math.ceil((new Date(lease.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {currentPayment ? (
                            <Badge variant={getPaymentStatusColor(currentPayment.status)}>
                              {currentPayment.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline">No payment due</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/rentals/leases/${lease.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  }).filter(Boolean)}
                </TableBody>
              </Table>
              {activeLeases.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No active leases found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}