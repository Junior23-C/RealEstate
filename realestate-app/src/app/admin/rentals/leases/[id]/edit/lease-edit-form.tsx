"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, FileText, Home, User, Save } from "lucide-react"
import { toast } from "sonner"

interface LeaseEditFormProps {
  lease: {
    id: string
    leaseNumber: string
    propertyId: string
    tenantId: string
    startDate: Date
    endDate: Date
    monthlyRent: number
    securityDeposit: number
    status: string
    terms?: string | null
    property: {
      id: string
      title: string
      address: string
      city: string
      state: string
      bedrooms: number
      bathrooms: number
      squareFeet: number
      price: number
    }
    tenant: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
    }
  }
  availableProperties: Array<{
    id: string
    title: string
    address: string
    city: string
    state: string
    bedrooms: number
    bathrooms: number
    squareFeet: number
    price: number
  }>
  tenants: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }>
}

export function LeaseEditForm({ lease, availableProperties, tenants }: LeaseEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string>(lease.propertyId)
  const [selectedTenant, setSelectedTenant] = useState<string>(lease.tenantId)
  
  const [formData, setFormData] = useState({
    startDate: lease.startDate.toISOString().split('T')[0],
    endDate: lease.endDate.toISOString().split('T')[0],
    monthlyRent: lease.monthlyRent.toString(),
    securityDeposit: lease.securityDeposit.toString(),
    status: lease.status,
    terms: lease.terms || ""
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProperty || !selectedTenant) {
      toast.error("Ju lutemi zgjidhni pronën dhe qiramarrësin")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/rentals/leases/${lease.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          propertyId: selectedProperty,
          tenantId: selectedTenant,
          startDate: formData.startDate,
          endDate: formData.endDate,
          monthlyRent: parseFloat(formData.monthlyRent),
          securityDeposit: parseFloat(formData.securityDeposit),
          status: formData.status,
          terms: formData.terms
        })
      })

      if (response.ok) {
        toast.success("Kontrata u përditësua me sukses")
        router.push(`/admin/rentals/leases/${lease.id}`)
        router.refresh()
      } else {
        const errorData = await response.text()
        toast.error(`Dështoi përditësimi i kontratës: ${errorData}`)
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë përditësimit të kontratës")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPropertyData = availableProperties.find(p => p.id === selectedProperty)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/rentals/leases/${lease.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ndrysho Kontratën</h1>
          <p className="text-muted-foreground">
            Kontrata #{lease.leaseNumber}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Zgjedh Pronën
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property">Prona</Label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zgjedh një pronë" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {property.city}, {property.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPropertyData && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">{selectedPropertyData.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedPropertyData.address}, {selectedPropertyData.city}, {selectedPropertyData.state}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>{selectedPropertyData.bedrooms} dhoma • {selectedPropertyData.bathrooms} banjo</span>
                    <span>{selectedPropertyData.squareFeet} m²</span>
                  </div>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(selectedPropertyData.price)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tenant Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Zgjedh Qiramarrësin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant">Qiramarrësi</Label>
                <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zgjedh një qiramarrës" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.firstName} {tenant.lastName} - {tenant.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTenant && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  {(() => {
                    const selectedTenantData = tenants.find(t => t.id === selectedTenant)
                    return selectedTenantData ? (
                      <>
                        <h4 className="font-medium">
                          {selectedTenantData.firstName} {selectedTenantData.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">{selectedTenantData.email}</p>
                        <p className="text-sm text-muted-foreground">{selectedTenantData.phone}</p>
                      </>
                    ) : null
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lease Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detajet e Kontratës
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data e Fillimit</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data e Përfundimit</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Qiraja Mujore ($)</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  step="0.01"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Depozita e Sigurisë ($)</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statusi</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zgjedh statusin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="TERMINATED">TERMINATED</SelectItem>
                    <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Kushtet e Kontratës</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                placeholder="Shkruani kushtet e kontratës këtu..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/rentals/leases/${lease.id}`}>
              Anulo
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Duke ruajtur...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Ruaj Ndryshimet
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}