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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center space-x-2 mr-6 hover:opacity-70 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">Property Management</span>
              <p className="text-xs text-muted-foreground">View and manage listings</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              All Properties ({properties.length})
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your property listings and view details
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="https://aliaj-re.com/properties" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                View on Site
              </Link>
            </Button>
            <Button asChild className="shadow-lg">
              <Link href="/admin/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Link>
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Image</TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Rental Info</TableHead>
                    <TableHead className="font-semibold">Inquiries</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
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
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-400"
                            >
                              <Link href={`https://aliaj-re.com/properties/${property.id}`} target="_blank" title="View Property">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900 dark:hover:text-green-400"
                            >
                              <Link href={`/admin/properties/${property.id}/edit`} title="Edit Property">
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingId(property.id)}
                              className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                              title="Delete Property"
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