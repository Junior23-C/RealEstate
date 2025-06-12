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
import { toast } from "sonner"

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
    features: property?.features ? JSON.parse(property.features) : [] as string[]
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
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price as string),
        type: formData.type,
        status: formData.status,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        bedrooms: parseInt(formData.bedrooms as string),
        bathrooms: parseFloat(formData.bathrooms as string),
        squareFeet: parseInt(formData.squareFeet as string),
        lotSize: formData.lotSize ? parseFloat(formData.lotSize as string) : null,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt as string) : null,
        features: JSON.stringify(formData.features),
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
        toast.success(`Prona u ${isEdit ? "përditësua" : "krijua"} me sukses`)
        router.push("/admin/properties")
      } else {
        const error = await response.text()
        toast.error(`Dështoi ${isEdit ? "përditësimi" : "krijimi"} i pronës: ${error}`)
      }
    } catch {
      toast.error(`Ndodhi një gabim gjatë ${isEdit ? "përditësimit" : "krijimit"} të pronës`)
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
          toast.error(`Dështoi ngarkimi i ${file.name}: ${error.error}`)
        }
      }
    } catch {
      toast.error("Dështoi ngarkimi i fotove")
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
            <span>Kthehu te Pronat</span>
          </Link>
          <span className="font-bold">
            {isEdit ? `Edito ${property?.title}` : "Shto Pronë të Re"}
          </span>
        </div>
      </header>

      <div className="container py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>
              {isEdit ? "Edito Pronën" : "Shto Pronë të Re"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Titulli i Pronës *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Përshkrimi *</Label>
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
                  <Label htmlFor="price">Çmimi *</Label>
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
                  <Label htmlFor="type">Tipi i Pronës *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PropertyType.HOUSE}>Shtëpi</SelectItem>
                      <SelectItem value={PropertyType.APARTMENT}>Apartament</SelectItem>
                      <SelectItem value={PropertyType.CONDO}>Kondo</SelectItem>
                      <SelectItem value={PropertyType.TOWNHOUSE}>Townhouse</SelectItem>
                      <SelectItem value={PropertyType.LAND}>Tokë</SelectItem>
                      <SelectItem value={PropertyType.COMMERCIAL}>Komerciale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Statusi *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PropertyStatus.FOR_RENT}>Për Qira</SelectItem>
                      <SelectItem value={PropertyStatus.FOR_SALE}>Për Shitje</SelectItem>
                      <SelectItem value={PropertyStatus.RENTED}>E Dhënë me Qira</SelectItem>
                      <SelectItem value={PropertyStatus.SOLD}>E Shitur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Adresa *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="city">Qyteti *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="state">Shteti/Rajoni *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">Kodi Postar *</Label>
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
                  <Label htmlFor="bedrooms">Dhoma Gjumi *</Label>
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
                  <Label htmlFor="bathrooms">Banjo *</Label>
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
                  <Label htmlFor="squareFeet">Metra Katrore *</Label>
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
                  <Label htmlFor="lotSize">Madhësia e Parcelës (hektarë)</Label>
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
                  <Label htmlFor="yearBuilt">Viti i Ndërtimit</Label>
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
                <Label>Karakteristikat & Komoditetet</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Shto një karakteristikë"
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

              {/* Rental Information Notice */}
              {formData.status === "RENTED" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Shënim:</strong> Për të menaxhuar informacionin e qirasë për këtë pronë, ju lutem përdorni seksionin e Menaxhimit të Qirave për të krijuar një kontratë me detajet e qiramarrësit.
                  </p>
                </div>
              )}

              {/* Images */}
              <div>
                <Label>Fotot e Pronës</Label>
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
                          <span className="text-sm text-muted-foreground">Duke ngarkuar...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Kliko për të ngarkuar fotot</span>
                          <span className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP (maks 5MB secila)</span>
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
                            {img.isPrimary ? "Kryesore" : "Bëje Kryesore"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* URL Input Section */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Ose shto foto me URL:</p>
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="URL e fotos"
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
                      Shto URL të Fotos
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
                      {isEdit ? "Duke përditësuar..." : "Duke krijuar..."}
                    </>
                  ) : (
                    isEdit ? "Përditëso Pronën" : "Krijo Pronën"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/properties">Anullo</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}