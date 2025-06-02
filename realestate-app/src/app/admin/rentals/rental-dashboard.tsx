"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

interface RentalDashboardProps {
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

export function RentalDashboard({ 
  stats, 
  activeLeases, 
  recentPayments, 
  upcomingPayments 
}: RentalDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'leases' | 'payments'>('overview')
  const [markingPayment, setMarkingPayment] = useState<string | null>(null)

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

  const markPaymentAsPaid = async (paymentId: string) => {
    setMarkingPayment(paymentId)
    try {
      const response = await fetch(`/api/rentals/payments/${paymentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "PAID",
          paidDate: new Date().toISOString(),
          paymentMethod: "CASH" // Default method, could be made configurable
        })
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Dështoi shënimi i pagesës si e paguar")
      }
    } catch (error) {
      console.error("Error marking payment as paid:", error)
      alert("Dështoi shënimi i pagesës si e paguar")
    } finally {
      setMarkingPayment(null)
    }
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center space-x-2 mr-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Kthehu në Panel</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold">Menaxhimi i Qirave</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kontratat Aktive</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLeases}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalLeases} kontrata gjithsej
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Të Ardhurat Mujore</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalMonthlyRent)}</div>
              <p className="text-xs text-muted-foreground">
                Nga {stats.rentedProperties} prona të dhëna me qira
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skadojnë Së Shpejti</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">
                Kontrata që përfundojnë brenda 30 ditëve
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagesa të Vonuara</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overduePayments}</div>
              <p className="text-xs text-muted-foreground">
                Kërkon vëmendje të menjehershme
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
          >
            Përmbledhje
          </Button>
          <Button
            variant={activeTab === 'leases' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('leases')}
          >
            Kontratat Aktive ({stats.activeLeases})
          </Button>
          <Button
            variant={activeTab === 'payments' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('payments')}
          >
            Pagesat
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Pagesat e Fundit
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
                    <p className="text-muted-foreground">Asnjë pagesë e fundit</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Pagesat e Ardhshme
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
                            {daysUntil === 0 ? 'Skadon sot' : 
                             daysUntil === 1 ? 'Skadon nesër' :
                             daysUntil > 0 ? `Skadon pas ${daysUntil} ditëve` :
                             `${Math.abs(daysUntil)} ditë vonuar`}
                          </p>
                        </div>
                      </div>
                    )
                  }).filter(Boolean)}
                  {upcomingPayments.filter(p => p.lease != null).length === 0 && (
                    <p className="text-muted-foreground">Asnjë pagesë e ardhshme</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'leases' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kontratat Aktive</CardTitle>
              <Button asChild>
                <Link href="/admin/rentals/leases/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Kontratë e Re
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prona</TableHead>
                      <TableHead>Qiramarrësi</TableHead>
                      <TableHead>Qiraja</TableHead>
                      <TableHead>Periudha e Kontratës</TableHead>
                      <TableHead>Statusi i Pagesës</TableHead>
                      <TableHead>Veprime</TableHead>
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
                              <Badge variant="outline">Asnjë pagesë për sot</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/rentals/leases/${lease.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    }).filter(Boolean)}
                  </TableBody>
                </Table>
                {activeLeases.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Asnjë kontratë aktive nuk u gjet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Këtë Muaj</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(recentPayments.reduce((sum, p) => sum + p.amount, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {recentPayments.length} pagesa të marra
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Në Pritje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(upcomingPayments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {upcomingPayments.filter(p => p.status === 'PENDING').length} pagesa në pritje
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Të Vonuara</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(upcomingPayments.filter(p => p.status === 'LATE').reduce((sum, p) => sum + p.amount, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {upcomingPayments.filter(p => p.status === 'LATE').length} pagesa të vonuara
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle>Pagesat e Ardhshme</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Qiramarrësi</TableHead>
                        <TableHead>Prona</TableHead>
                        <TableHead>Shuma</TableHead>
                        <TableHead>Data e Skadimit</TableHead>
                        <TableHead>Statusi</TableHead>
                        <TableHead>Veprime</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingPayments.map((payment) => {
                        if (!payment.lease) return null
                        
                        const daysUntil = getDaysUntilDue(payment.dueDate)
                        
                        return (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {payment.lease.tenant?.firstName || 'Unknown'} {payment.lease.tenant?.lastName || 'Tenant'}
                            </TableCell>
                            <TableCell>{payment.lease.property?.title || 'Unknown Property'}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p>{formatDate(payment.dueDate)}</p>
                                <p className={`text-sm ${
                                  daysUntil <= 3 ? 'text-red-600' : 
                                  daysUntil <= 7 ? 'text-orange-600' : 'text-muted-foreground'
                                }`}>
                                  {daysUntil === 0 ? 'Skadon sot' : 
                                   daysUntil === 1 ? 'Skadon nesër' :
                                   daysUntil > 0 ? `${daysUntil} ditë` :
                                   `${Math.abs(daysUntil)} ditë vonuar`}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPaymentStatusColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {payment.status === 'PENDING' || payment.status === 'LATE' ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => markPaymentAsPaid(payment.id)}
                                  disabled={markingPayment === payment.id}
                                >
                                  {markingPayment === payment.id ? "Duke shënuar..." : "Shëno si Paguar"}
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground">Paguar</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      }).filter(Boolean)}
                    </TableBody>
                  </Table>
                  {upcomingPayments.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      Asnjë pagesë e ardhshme
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}