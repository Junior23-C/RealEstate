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
    emergencyContactPhone: string | null
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
    return new Intl.NumberFormat('sq-AL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sq-AL')
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
        .filter(lease => lease.status === 'ACTIVE' && lease.monthlyRent != null)
        .reduce((sum, lease) => sum + (lease.monthlyRent || 0), 0), 0
    )
  }

  return (
    <div className="min-h-screen bg-muted/50">

      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Menaxhimi i Qiramarrësve</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Menaxhoni qiramarrësit tuaj dhe informacionet e tyre
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qiramarrësit Gjithsej</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTenants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kontratat Aktive</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLeases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Të Ardhurat Mujore</CardTitle>
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
              placeholder="Kërko qiramarrësit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button asChild>
            <Link href="/admin/rentals/tenants/new">
              <Plus className="h-4 w-4 mr-2" />
              Shto Qiramarrës
            </Link>
          </Button>
        </div>

        {/* Tenants Table/Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Të Gjithë Qiramarrësit ({filteredTenants.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Qiramarrësi</TableHead>
                    <TableHead>Kontakti</TableHead>
                    <TableHead>Prona Aktuale</TableHead>
                    <TableHead>Statusi i Kontratës</TableHead>
                    <TableHead>Qiraja Mujore</TableHead>
                    <TableHead>Statusi i Pagesës</TableHead>
                    <TableHead>Veprime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => {
                    const activeLease = tenant.leases.find(lease => lease.status === 'ACTIVE')
                    const currentPayment = activeLease?.payments?.[0]
                    
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
                          {activeLease && activeLease.property ? (
                            <div>
                              <p className="font-medium">{activeLease.property.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {activeLease.property.city}, {activeLease.property.state}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Asnjë kontratë aktive</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {activeLease ? (
                            <div>
                              <Badge variant={getLeaseStatusColor(activeLease.status)}>
                                {activeLease.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                Deri {formatDate(activeLease.endDate)}
                              </p>
                            </div>
                          ) : (
                            <Badge variant="outline">Pa kontratë</Badge>
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
                                Skadon: {formatDate(currentPayment.dueDate)}
                              </p>
                            </div>
                          ) : activeLease ? (
                            <Badge variant="outline">Asnjë pagesë për sot</Badge>
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
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredTenants.map((tenant) => {
                const activeLease = tenant.leases.find(lease => lease.status === 'ACTIVE')
                const currentPayment = activeLease?.payments?.[0]
                
                return (
                  <div key={tenant.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                    {/* Header with name and action button */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">
                          {tenant.firstName} {tenant.lastName}
                        </h3>
                        {tenant.employer && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {tenant.employer}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild className="ml-3">
                        <Link href={`/admin/rentals/tenants/${tenant.id}`} className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Shiko</span>
                        </Link>
                      </Button>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="break-all">{tenant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{formatPhone(tenant.phone)}</span>
                      </div>
                    </div>

                    {/* Property Information */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Home className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Prona Aktuale</span>
                      </div>
                      {activeLease && activeLease.property ? (
                        <div>
                          <p className="font-medium text-sm">{activeLease.property.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {activeLease.property.city}, {activeLease.property.state}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Asnjë kontratë aktive</p>
                      )}
                    </div>

                    {/* Status and Payment Info */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Lease Status */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Statusi i Kontratës</p>
                        {activeLease ? (
                          <div className="space-y-1">
                            <Badge variant={getLeaseStatusColor(activeLease.status)} className="text-xs">
                              {activeLease.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              Deri {formatDate(activeLease.endDate)}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">Pa kontratë</Badge>
                        )}
                      </div>

                      {/* Monthly Rent */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Qiraja Mujore</p>
                        {activeLease ? (
                          <p className="font-semibold text-green-600">
                            {formatCurrency(activeLease.monthlyRent)}
                          </p>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-muted-foreground mb-2">Statusi i Pagesës</p>
                      {currentPayment ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getPaymentStatusColor(currentPayment.status)} className="text-xs">
                            {currentPayment.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Skadon: {formatDate(currentPayment.dueDate)}
                          </span>
                        </div>
                      ) : activeLease ? (
                        <Badge variant="outline" className="text-xs">Asnjë pagesë për sot</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty State */}
            {filteredTenants.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                {searchTerm ? "Asnjë qiramarrës nuk u gjet sipas kërkimit tuaj" : "Asnjë qiramarrës nuk u gjet"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}