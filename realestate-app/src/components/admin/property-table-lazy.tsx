"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"

interface Property {
  id: string
  title: string
  price: number
  status: string
  type: string
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  createdAt: Date
  images: Array<{ url: string; alt: string | null }>
}

interface PropertyTableLazyProps {
  initialProperties: Property[]
  initialTotal: number
  initialPage: number
}

export function PropertyTableLazy({ 
  initialProperties, 
  initialTotal, 
  initialPage 
}: PropertyTableLazyProps) {
  const [properties, setProperties] = useState(initialProperties)
  const [total, setTotal] = useState(initialTotal)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 500)

  const itemsPerPage = 10
  const totalPages = Math.ceil(total / itemsPerPage)

  // Memoized status labels for performance
  const getStatusLabel = useCallback((status: string) => {
    const labels = {
      "FOR_RENT": { label: "Me Qira", variant: "default" as const },
      "FOR_SALE": { label: "Për Shitje", variant: "secondary" as const },
      "RENTED": { label: "E Dhënë me Qira", variant: "outline" as const },
      "SOLD": { label: "E Shitur", variant: "destructive" as const }
    }
    return labels[status as keyof typeof labels] || { label: status, variant: "outline" as const }
  }, [])

  // Memoized type labels
  const getTypeLabel = useCallback((type: string) => {
    const labels = {
      "HOUSE": "Shtëpi",
      "APARTMENT": "Apartament", 
      "CONDO": "Kondominium",
      "TOWNHOUSE": "Vilë",
      "LAND": "Tokë",
      "COMMERCIAL": "Komerciale"
    }
    return labels[type as keyof typeof labels] || type
  }, [])

  // Format price with Albanian locale
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('sq-AL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }, [])

  // Fetch properties with search and pagination
  const fetchProperties = useCallback(async (page: number, searchTerm?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/properties?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties)
        setTotal(data.total)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle search changes
  const handleSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm !== debouncedSearch) return
    await fetchProperties(1, searchTerm)
  }, [debouncedSearch, fetchProperties])

  // Effect for search
  useState(() => {
    if (debouncedSearch !== search) {
      handleSearch(debouncedSearch)
    }
  })

  // Handle pagination
  const handlePageChange = useCallback(async (page: number) => {
    await fetchProperties(page, debouncedSearch)
  }, [fetchProperties, debouncedSearch])

  // Memoized table rows for performance
  const tableRows = useMemo(() => (
    properties.map((property) => {
      const status = getStatusLabel(property.status)
      const primaryImage = property.images?.[0]

      return (
        <tr key={property.id} className="border-b hover:bg-muted/50">
          <td className="px-4 py-3">
            <div className="flex items-center space-x-3">
              {primaryImage && (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt || property.title}
                  className="h-12 w-12 rounded object-cover"
                  loading="lazy" // Lazy load images
                />
              )}
              <div>
                <Link 
                  href={`/admin/properties/${property.id}/edit`}
                  className="font-medium hover:underline"
                >
                  {property.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {property.city}, {property.state}
                </p>
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="font-medium">{formatPrice(property.price)}</div>
            <p className="text-sm text-muted-foreground">
              {getTypeLabel(property.type)}
            </p>
          </td>
          <td className="px-4 py-3">
            <Badge variant={status.variant}>{status.label}</Badge>
          </td>
          <td className="px-4 py-3 text-sm text-muted-foreground">
            {property.bedrooms} dhoma • {property.bathrooms} banjo
          </td>
          <td className="px-4 py-3 text-sm text-muted-foreground">
            {property.squareFeet.toLocaleString()} m²
          </td>
          <td className="px-4 py-3 text-sm text-muted-foreground">
            {new Intl.DateTimeFormat('sq-AL', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }).format(new Date(property.createdAt))}
          </td>
        </tr>
      )
    })
  ), [properties, getStatusLabel, getTypeLabel, formatPrice])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pronat ({total})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kërkoni prona..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">Duke ngarkuar...</p>
          </div>
        )}

        {!loading && (
          <>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Prona</th>
                    <th className="px-4 py-3 text-left font-medium">Çmimi</th>
                    <th className="px-4 py-3 text-left font-medium">Statusi</th>
                    <th className="px-4 py-3 text-left font-medium">Dhoma</th>
                    <th className="px-4 py-3 text-left font-medium">Sipërfaqja</th>
                    <th className="px-4 py-3 text-left font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Nuk u gjetën prona.
                      </td>
                    </tr>
                  ) : (
                    tableRows
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Faqja {currentPage} nga {totalPages} ({total} prona)
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Mbrapa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                  >
                    Përpara
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}