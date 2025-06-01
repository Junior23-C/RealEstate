"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all" || !value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/properties")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-2 block">Property Status</Label>
          <RadioGroup
            defaultValue={searchParams.get("status") || "all"}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PropertyStatus.FOR_RENT} id="for-rent" />
              <Label htmlFor="for-rent">For Rent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PropertyStatus.FOR_SALE} id="for-sale" />
              <Label htmlFor="for-sale">For Sale</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="type" className="mb-2 block">Property Type</Label>
          <Select
            value={searchParams.get("type") || "all"}
            onValueChange={(value) => updateFilter("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
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
          <Label htmlFor="bedrooms" className="mb-2 block">Bedrooms</Label>
          <Select
            value={searchParams.get("bedrooms") || "all"}
            onValueChange={(value) => updateFilter("bedrooms", value)}
          >
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bathrooms" className="mb-2 block">Bathrooms</Label>
          <Select
            value={searchParams.get("bathrooms") || "all"}
            onValueChange={(value) => updateFilter("bathrooms", value)}
          >
            <SelectTrigger id="bathrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}