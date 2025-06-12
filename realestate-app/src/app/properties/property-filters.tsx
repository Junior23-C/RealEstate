"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
// Property type and status constants
const PropertyType = {
  HOUSE: 'HOUSE',
  APARTMENT: 'APARTMENT',
  CONDO: 'CONDO',
  TOWNHOUSE: 'TOWNHOUSE',
  LAND: 'LAND',
  COMMERCIAL: 'COMMERCIAL'
} as const

const PropertyStatus = {
  FOR_RENT: 'FOR_RENT',
  FOR_SALE: 'FOR_SALE',
  RENTED: 'RENTED',
  SOLD: 'SOLD'
} as const

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    type: searchParams.get("type") || "all", 
    bedrooms: searchParams.get("bedrooms") || "all",
    bathrooms: searchParams.get("bathrooms") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || ""
  })

  // Update local state when URL changes
  useEffect(() => {
    setFilters({
      status: searchParams.get("status") || "all",
      type: searchParams.get("type") || "all",
      bedrooms: searchParams.get("bedrooms") || "all", 
      bathrooms: searchParams.get("bathrooms") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || ""
    })
  }, [searchParams])

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value)
      }
    })
    
    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      bedrooms: "all",
      bathrooms: "all", 
      minPrice: "",
      maxPrice: ""
    })
    router.push("/properties")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtrat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-2 block">Statusi i Pronës</Label>
          <RadioGroup
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Të Gjitha</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PropertyStatus.FOR_RENT} id="for-rent" />
              <Label htmlFor="for-rent">Me Qira</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PropertyStatus.FOR_SALE} id="for-sale" />
              <Label htmlFor="for-sale">Për Shitje</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="type" className="mb-2 block">Lloji i Pronës</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => updateFilter("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Zgjidh llojin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të Gjitha Llojet</SelectItem>
              <SelectItem value={PropertyType.HOUSE}>Shtëpi</SelectItem>
              <SelectItem value={PropertyType.APARTMENT}>Apartament</SelectItem>
              <SelectItem value={PropertyType.CONDO}>Kondominium</SelectItem>
              <SelectItem value={PropertyType.TOWNHOUSE}>Vilë</SelectItem>
              <SelectItem value={PropertyType.LAND}>Tokë</SelectItem>
              <SelectItem value={PropertyType.COMMERCIAL}>Komerciale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bedrooms" className="mb-2 block">Dhoma Gjumi</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => updateFilter("bedrooms", value)}
          >
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Cilado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cilado</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bathrooms" className="mb-2 block">Banjo</Label>
          <Select
            value={filters.bathrooms}
            onValueChange={(value) => updateFilter("bathrooms", value)}
          >
            <SelectTrigger id="bathrooms">
              <SelectValue placeholder="Cilado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cilado</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Çmimi</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={applyFilters} className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Kërko
          </Button>
          <Button onClick={clearFilters} variant="outline" className="w-full">
            Pastro Filtrat
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}