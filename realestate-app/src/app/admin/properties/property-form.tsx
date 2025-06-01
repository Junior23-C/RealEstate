"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, Loader2, Upload } from "lucide-react"
import { PropertyType, PropertyStatus } from "@/lib/constants"

interface PropertyFormProps {
  property?: {
    id: string
    title: string
    description: string
    price: number
    type: string
    status: string
    address: string
    city: string
    state: string
    zipCode: string
    bedrooms: number
    bathrooms: number
    squareFeet: number
    lotSize?: number | null
    yearBuilt?: number | null
    features?: string | null
    rentedDate?: Date | null
    rentEndDate?: Date | null
    tenantName?: string | null
    tenantEmail?: string | null
    tenantPhone?: string | null
    images?: Array<{
      id: string
      url: string
      alt?: string | null
      isPrimary: boolean
      propertyId: string
      createdAt: Date
    }>
  }
  isEdit?: boolean
}

export function PropertyForm({ property, isEdit = false }: PropertyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || "",
    type: property?.type || PropertyType.HOUSE,
    status: property?.status || PropertyStatus.FOR_RENT,
    address: property?.address || "",
    city: property?.city || "",
    state: property?.state || "",
    zipCode: property?.zipCode || "",
    bedrooms: property?.bedrooms || "",
    bathrooms: property?.bathrooms || "",
    squareFeet: property?.squareFeet || "",
    lotSize: property?.lotSize || "",
    yearBuilt: property?.yearBuilt || "",
    features: property?.features ? JSON.parse(property.features) : [] as string[],
    rentedDate: property?.rentedDate ? new Date(property.rentedDate).toISOString().split('T')[0] : "",
    rentEndDate: property?.rentEndDate ? new Date(property.rentEndDate).toISOString().split('T')[0] : "",
    tenantName: property?.tenantName || "",
    tenantEmail: property?.tenantEmail || "",
    tenantPhone: property?.tenantPhone || ""
  })
  const [newFeature, setNewFeature] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>(
    isEdit ? [""] : [""]  // Don't duplicate URLs in edit mode since they're in uploadedImages
  )
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, isPrimary: boolean}>>(
    property?.images?.map((img) => ({ url: img.url, isPrimary: img.isPrimary })) || []
  )
  const [uploadingImages, setUploadingImages] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Combine uploaded images and URL images
      const allImageUrls = [
        ...uploadedImages.map(img => img.url),
        ...imageUrls.filter(url => url.trim() !== "")
      ]
      
      const requestData = {
        ...formData,
        price: parseFloat(formData.price as string),
        bedrooms: parseInt(formData.bedrooms as string),
        bathrooms: parseFloat(formData.bathrooms as string),
        squareFeet: parseInt(formData.squareFeet as string),
        lotSize: formData.lotSize ? parseFloat(formData.lotSize as string) : null,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt as string) : null,
        features: JSON.stringify(formData.features),
        rentedDate: formData.rentedDate ? new Date(formData.rentedDate as string).toISOString() : null,
        rentEndDate: formData.rentEndDate ? new Date(formData.rentEndDate as string).toISOString() : null,
        tenantName: formData.tenantName || null,
        tenantEmail: formData.tenantEmail || null,
        tenantPhone: formData.tenantPhone || null,
        imageUrls: allImageUrls,
        primaryImageIndex: uploadedImages.findIndex(img => img.isPrimary)
      }

      const url = isEdit ? `/api/properties/${property?.id}` : "/api/properties"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        router.push("/admin/properties")
      } else {
        const error = await response.text()
        alert(`Failed to ${isEdit ? "update" : "create"} property: ${error}`)
      }
    } catch (error) {
      console.error("Error submitting property:", error)
      alert(`Failed to ${isEdit ? "update" : "create"} property`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_: string, i: number) => i !== index)
    }))
  }

  const addImageUrl = () => {
    setImageUrls(prev => [...prev, ""])
  }

  const updateImageUrl = (index: number, url: string) => {
    setImageUrls(prev => prev.map((item, i) => i === index ? url : item))
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })
        
        if (response.ok) {
          const { url } = await response.json()
          setUploadedImages(prev => [...prev, { url, isPrimary: prev.length === 0 }])
        } else {
          const error = await response.json()
          alert(`Failed to upload ${file.name}: ${error.error}`)
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload images")
    } finally {
      setUploadingImages(false)
      // Clear the input
      e.target.value = ""
    }
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      // If we removed the primary image, make the first one primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true
      }
      return newImages
    })
  }

  const setPrimaryImage = (index: number) => {
    setUploadedImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })))
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/admin/properties" className="flex items-center space-x-2 mr-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Properties</span>
          </Link>
          <span className="font-bold">
            {isEdit ? `Edit ${property?.title}` : "Add New Property"}
          </span>
        </div>
      </header>

      <div className="container py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>
              {isEdit ? "Edit Property" : "Add New Property"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Property Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PropertyType.HOUSE}>House</SelectItem>
                      <SelectItem value={PropertyType.APARTMENT}>Apartment</SelectItem>
                      <SelectItem value={PropertyType.CONDO}>Condo</SelectItem>
                      <SelectItem value={PropertyType.TOWNHOUSE}>Townhouse</SelectItem>
                      <SelectItem value={PropertyType.LAND}>Land</SelectItem>
                      <SelectItem value={PropertyType.COMMERCIAL}>Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PropertyStatus.FOR_RENT}>For Rent</SelectItem>
                      <SelectItem value={PropertyStatus.FOR_SALE}>For Sale</SelectItem>
                      <SelectItem value={PropertyStatus.RENTED}>Rented</SelectItem>
                      <SelectItem value={PropertyStatus.SOLD}>Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleChange("zipCode", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleChange("bedrooms", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => handleChange("bathrooms", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="squareFeet">Square Feet *</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    min="0"
                    value={formData.squareFeet}
                    onChange={(e) => handleChange("squareFeet", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="lotSize">Lot Size (acres)</Label>
                  <Input
                    id="lotSize"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.lotSize}
                    onChange={(e) => handleChange("lotSize", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.yearBuilt}
                    onChange={(e) => handleChange("yearBuilt", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <Label>Features & Amenities</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                      disabled={isLoading}
                    />
                    <Button type="button" onClick={addFeature} disabled={isLoading}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() => removeFeature(index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rental Tracking */}
              {(formData.status === "RENTED" || formData.status === "FOR_RENT") && (
                <div>
                  <Label className="text-base font-semibold">Rental Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="rentedDate">Rental Start Date</Label>
                      <Input
                        id="rentedDate"
                        type="date"
                        value={formData.rentedDate}
                        onChange={(e) => handleChange("rentedDate", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="rentEndDate">Rental End Date</Label>
                      <Input
                        id="rentEndDate"
                        type="date"
                        value={formData.rentEndDate}
                        onChange={(e) => handleChange("rentEndDate", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tenantName">Tenant Name</Label>
                      <Input
                        id="tenantName"
                        placeholder="Enter tenant's full name"
                        value={formData.tenantName}
                        onChange={(e) => handleChange("tenantName", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tenantEmail">Tenant Email</Label>
                      <Input
                        id="tenantEmail"
                        type="email"
                        placeholder="tenant@example.com"
                        value={formData.tenantEmail}
                        onChange={(e) => handleChange("tenantEmail", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tenantPhone">Tenant Phone</Label>
                      <Input
                        id="tenantPhone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.tenantPhone}
                        onChange={(e) => handleChange("tenantPhone", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Images */}
              <div>
                <Label>Property Images</Label>
                <div className="space-y-4">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed rounded-lg p-6">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isLoading || uploadingImages}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      {uploadingImages ? (
                        <>
                          <Loader2 className="h-10 w-10 text-muted-foreground mb-2 animate-spin" />
                          <span className="text-sm text-muted-foreground">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Click to upload images</span>
                          <span className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP (max 5MB each)</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={img.url}
                              alt={`Property image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeUploadedImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant={img.isPrimary ? "default" : "outline"}
                            size="sm"
                            className="absolute bottom-2 left-2 text-xs"
                            onClick={() => setPrimaryImage(index)}
                          >
                            {img.isPrimary ? "Primary" : "Set Primary"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* URL Input Section */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Or add images by URL:</p>
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Image URL"
                          value={url}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeImageUrl(index)}
                          disabled={isLoading || imageUrls.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={addImageUrl} variant="outline" disabled={isLoading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image URL
                    </Button>
                  </div>
                </div>
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
                    isEdit ? "Update Property" : "Create Property"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/properties">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}