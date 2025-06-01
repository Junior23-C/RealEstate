"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Users } from "lucide-react"

interface TenantFormProps {
  tenant?: {
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
  }
  isEdit?: boolean
}

export function TenantForm({ tenant, isEdit = false }: TenantFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: tenant?.firstName || "",
    lastName: tenant?.lastName || "",
    email: tenant?.email || "",
    phone: tenant?.phone || "",
    dateOfBirth: tenant?.dateOfBirth ? new Date(tenant.dateOfBirth).toISOString().split('T')[0] : "",
    ssn: tenant?.ssn || "",
    emergencyContact: tenant?.emergencyContact || "",
    emergencyPhone: tenant?.emergencyPhone || "",
    employer: tenant?.employer || "",
    monthlyIncome: tenant?.monthlyIncome || "",
    notes: tenant?.notes || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const requestData = {
        ...formData,
        monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome as string) : null,
        dateOfBirth: formData.dateOfBirth || null
      }

      const url = isEdit ? `/api/rentals/tenants/${tenant?.id}` : "/api/rentals/tenants"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        router.push("/admin/rentals/tenants")
      } else {
        const error = await response.text()
        alert(`Failed to ${isEdit ? "update" : "create"} tenant: ${error}`)
      }
    } catch (error) {
      console.error("Error submitting tenant:", error)
      alert(`Failed to ${isEdit ? "update" : "create"} tenant`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/admin/rentals/tenants" className="flex items-center space-x-2 mr-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tenants</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span className="font-bold">
              {isEdit ? `Edit ${tenant?.firstName} ${tenant?.lastName}` : "Add New Tenant"}
            </span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>
              {isEdit ? "Edit Tenant" : "Add New Tenant"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ssn">SSN (Last 4 digits)</Label>
                    <Input
                      id="ssn"
                      value={formData.ssn}
                      onChange={(e) => handleChange("ssn", e.target.value)}
                      placeholder="****"
                      maxLength={4}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleChange("emergencyContact", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employer">Employer</Label>
                    <Input
                      id="employer"
                      value={formData.employer}
                      onChange={(e) => handleChange("employer", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Additional notes about the tenant..."
                  disabled={isLoading}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEdit ? "Update Tenant" : "Create Tenant"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/rentals/tenants">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}