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
import { ArrowLeft, Loader2, FileText, Home, User } from "lucide-react"

interface LeaseFormProps {
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

export function LeaseForm({ availableProperties, tenants }: LeaseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string>("")
  const [selectedTenant, setSelectedTenant] = useState<string>("")
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    monthlyRent: "",
    securityDeposit: "",
    petDeposit: "",
    lateFee: "50",
    rentDueDay: "1",
    notes: ""
  })

  // Calculate end date one year from start date
  const handleStartDateChange = (date: string) => {
    setFormData(prev => {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setFullYear(endDate.getFullYear() + 1)
      endDate.setDate(endDate.getDate() - 1) // One day before anniversary
      
      return {
        ...prev,
        startDate: date,
        endDate: endDate.toISOString().split('T')[0]
      }
    })
  }

  // Auto-fill rent amount when property is selected
  const handlePropertyChange = (propertyId: string) => {
    setSelectedProperty(propertyId)
    const property = availableProperties.find(p => p.id === propertyId)
    if (property) {
      setFormData(prev => ({
        ...prev,
        monthlyRent: property.price.toString()
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const requestData = {
        propertyId: selectedProperty,
        tenantId: selectedTenant,
        ...formData,
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null,
        petDeposit: formData.petDeposit ? parseFloat(formData.petDeposit) : null,
        lateFee: parseFloat(formData.lateFee),
        rentDueDay: parseInt(formData.rentDueDay)
      }

      const response = await fetch("/api/rentals/leases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Lease created successfully! ${result.paymentsCreated} monthly payments have been scheduled.`)
        router.push("/admin/rentals")
      } else {
        const error = await response.text()
        alert(`Failed to create lease: ${error}`)
      }
    } catch (error) {
      console.error("Error creating lease:", error)
      alert("Failed to create lease")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const selectedPropertyData = availableProperties.find(p => p.id === selectedProperty)
  const selectedTenantData = tenants.find(t => t.id === selectedTenant)

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
            <FileText className="h-6 w-6" />
            <span className="font-bold">Create New Lease</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Selection Summary */}
          {(selectedProperty || selectedTenant) && (
            <Card>
              <CardHeader>
                <CardTitle>Lease Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPropertyData && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span className="font-medium">Property</span>
                      </div>
                      <div className="pl-6">
                        <p className="font-medium">{selectedPropertyData.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPropertyData.address}, {selectedPropertyData.city}, {selectedPropertyData.state}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPropertyData.bedrooms} bed, {selectedPropertyData.bathrooms} bath, {selectedPropertyData.squareFeet} sq ft
                        </p>
                        <p className="text-sm font-medium">
                          {formatCurrency(selectedPropertyData.price)}/month
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedTenantData && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Tenant</span>
                      </div>
                      <div className="pl-6">
                        <p className="font-medium">
                          {selectedTenantData.firstName} {selectedTenantData.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedTenantData.email}</p>
                        <p className="text-sm text-muted-foreground">{selectedTenantData.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lease Form */}
          <Card>
            <CardHeader>
              <CardTitle>Lease Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property and Tenant Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="property">Property *</Label>
                    <Select value={selectedProperty} onValueChange={handlePropertyChange} disabled={isLoading}>
                      <SelectTrigger id="property">
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProperties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            <div>
                              <div className="font-medium">{property.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {property.city}, {property.state} - {formatCurrency(property.price)}/mo
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableProperties.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        No available properties. Properties must have &quot;FOR_RENT&quot; status.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tenant">Tenant *</Label>
                    <Select value={selectedTenant} onValueChange={setSelectedTenant} disabled={isLoading}>
                      <SelectTrigger id="tenant">
                        <SelectValue placeholder="Select a tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            <div>
                              <div className="font-medium">{tenant.firstName} {tenant.lastName}</div>
                              <div className="text-sm text-muted-foreground">{tenant.email}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {tenants.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        No tenants available. <Link href="/admin/rentals/tenants/new" className="text-primary underline">Add a tenant first</Link>.
                      </p>
                    )}
                  </div>
                </div>

                {/* Lease Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Lease Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">Lease End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Auto-calculated as 1 year from start date
                    </p>
                  </div>
                </div>

                {/* Financial Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="monthlyRent">Monthly Rent *</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.monthlyRent}
                      onChange={(e) => handleChange("monthlyRent", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="securityDeposit">Security Deposit</Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.securityDeposit}
                      onChange={(e) => handleChange("securityDeposit", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="petDeposit">Pet Deposit</Label>
                    <Input
                      id="petDeposit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.petDeposit}
                      onChange={(e) => handleChange("petDeposit", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lateFee">Late Fee</Label>
                    <Input
                      id="lateFee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.lateFee}
                      onChange={(e) => handleChange("lateFee", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rentDueDay">Rent Due Day</Label>
                    <Select value={formData.rentDueDay} onValueChange={(value) => handleChange("rentDueDay", value)} disabled={isLoading}>
                      <SelectTrigger id="rentDueDay">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Day of month rent is due
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Lease Notes</Label>
                  <Textarea
                    id="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Additional lease terms, special conditions, etc..."
                    disabled={isLoading}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !selectedProperty || !selectedTenant || !formData.startDate || !formData.endDate || !formData.monthlyRent}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Lease...
                      </>
                    ) : (
                      "Create Lease"
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/rentals">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}