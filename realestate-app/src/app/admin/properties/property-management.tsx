"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Mail
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PropertyManagementProps {
  properties: Array<{
    id: string
    title: string
    city: string
    state: string
    type: string
    status: string
    price: number
    rentedDate?: Date | null
    rentEndDate?: Date | null
    tenantName?: string | null
    tenantEmail?: string | null
    tenantPhone?: string | null
    images: Array<{
      id: string
      url: string
      alt?: string | null
      isPrimary: boolean
      propertyId: string
      createdAt: Date
    }>
    _count: {
      inquiries: number
    }
  }>
}

export function PropertyManagement({ properties }: PropertyManagementProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete property")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("Failed to delete property")
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FOR_RENT":
        return "default"
      case "FOR_SALE":
        return "secondary"
      case "RENTED":
        return "outline"
      case "SOLD":
        return "outline"
      default:
        return "default"
    }
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
            <Building2 className="h-6 w-6" />
            <span className="font-bold">Property Management</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Properties ({properties.length})</h1>
          <Button asChild>
            <Link href="/admin/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rental Info</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => {
                    const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0]
                    
                    return (
                      <TableRow key={property.id}>
                        <TableCell>
                          {primaryImage ? (
                            <div className="relative h-16 w-24 rounded overflow-hidden">
                              <Image
                                src={primaryImage.url}
                                alt={property.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-24 bg-muted rounded flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-xs truncate">
                          {property.title}
                        </TableCell>
                        <TableCell>{property.city}, {property.state}</TableCell>
                        <TableCell>{property.type}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(property.status)}>
                            {property.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatPrice(property.price)}
                          {property.status === "FOR_RENT" && "/mo"}
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          {property.status === "RENTED" && property.rentedDate && (
                            <div className="text-sm">
                              <div className="text-green-600 font-medium">
                                Rented
                              </div>
                              <div className="text-muted-foreground">
                                Since: {new Date(property.rentedDate).toLocaleDateString()}
                              </div>
                              {property.rentEndDate && (
                                <div className="text-muted-foreground">
                                  Until: {new Date(property.rentEndDate).toLocaleDateString()}
                                </div>
                              )}
                              {property.tenantName && (
                                <div className="text-muted-foreground truncate">
                                  Tenant: {property.tenantName}
                                </div>
                              )}
                            </div>
                          )}
                          {property.status !== "RENTED" && property.status !== "FOR_RENT" && (
                            <div className="text-sm text-muted-foreground">
                              -
                            </div>
                          )}
                          {property.status === "FOR_RENT" && (
                            <div className="text-sm text-muted-foreground">
                              Available
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {property._count.inquiries}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <Link href={`/properties/${property.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <Link href={`/admin/properties/${property.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingId(property.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property
              and all associated data including images and inquiries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && handleDelete(deletingId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}