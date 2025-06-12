"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, X } from "lucide-react"

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

interface MobileFilterSheetProps {
  totalProperties?: number
}

export function MobileFilterSheet({ totalProperties }: MobileFilterSheetProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    type: searchParams.get("type") || "all", 
    bedrooms: searchParams.get("bedrooms") || "all",
    bathrooms: searchParams.get("bathrooms") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || ""
  })

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
    setOpen(false)
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
    setOpen(false)
  }

  const hasActiveFilters = Object.entries(filters).some(([, value]) => 
    value && value !== "all" && value !== ""
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtrat
          {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[85vh] flex flex-col">
        <SheetHeader className="pb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle>Filtrat</SheetTitle>
            {totalProperties && (
              <span className="text-sm text-muted-foreground">
                {totalProperties} prona
              </span>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y pb-4">
          <div className="space-y-6">
          <div>
            <Label className="mb-3 block text-base font-medium">Statusi i Pronës</Label>
            <RadioGroup
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="all" id="mobile-all" />
                <Label htmlFor="mobile-all" className="text-base">Të Gjitha</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={PropertyStatus.FOR_RENT} id="mobile-for-rent" />
                <Label htmlFor="mobile-for-rent" className="text-base">Me Qira</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={PropertyStatus.FOR_SALE} id="mobile-for-sale" />
                <Label htmlFor="mobile-for-sale" className="text-base">Për Shitje</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="mobile-type" className="mb-3 block text-base font-medium">Lloji i Pronës</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => updateFilter("type", value)}
            >
              <SelectTrigger id="mobile-type" className="h-12">
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
            <Label htmlFor="mobile-bedrooms" className="mb-3 block text-base font-medium">Dhoma Gjumi</Label>
            <Select
              value={filters.bedrooms}
              onValueChange={(value) => updateFilter("bedrooms", value)}
            >
              <SelectTrigger id="mobile-bedrooms" className="h-12">
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
            <Label htmlFor="mobile-bathrooms" className="mb-3 block text-base font-medium">Banjo</Label>
            <Select
              value={filters.bathrooms}
              onValueChange={(value) => updateFilter("bathrooms", value)}
            >
              <SelectTrigger id="mobile-bathrooms" className="h-12">
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
            <Label className="mb-3 block text-base font-medium">Çmimi</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="h-12"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="flex-shrink-0 bg-background pt-6 space-y-3 border-t">
          <Button onClick={applyFilters} className="w-full h-12 text-base">
            <Search className="mr-2 h-5 w-5" />
            Shfaq Rezultatet
          </Button>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" className="w-full h-12 text-base">
              <X className="mr-2 h-5 w-5" />
              Pastro Filtrat
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}