"use client"

import { useState, useEffect, memo, useCallback, useMemo } from "react"
import { PropertyCard } from "@/components/property-card"
import { SmartSearchParams } from "@/lib/smart-search"
import { PropertyForClient } from "@/types/property"

interface PropertyListClientProps {
  initialProperties: PropertyForClient[]
  smartSearchParams?: SmartSearchParams
  activeTab: string
}

const PropertyListClient = memo(function PropertyListClient({ 
  initialProperties, 
  smartSearchParams, 
  activeTab 
}: PropertyListClientProps) {
  const [properties, setProperties] = useState<PropertyForClient[]>(initialProperties)
  const [isLoading, setIsLoading] = useState(false)

  const buildQueryFromParams = useCallback((params: SmartSearchParams): string => {
    const parts: string[] = []
    
    if (params.bedrooms) parts.push(`${params.bedrooms} dhoma gjumi`)
    if (params.bathrooms) parts.push(`${params.bathrooms} banjo`)
    if (params.type) {
      const typeMap: Record<string, string> = {
        'APARTMENT': 'apartament',
        'HOUSE': 'shtëpi', 
        'VILLA': 'vilë',
        'LAND': 'tokë',
        'COMMERCIAL': 'komerciale'
      }
      parts.push(typeMap[params.type] || params.type)
    }
    if (params.status) {
      const statusMap: Record<string, string> = {
        'FOR_RENT': 'për qira',
        'FOR_SALE': 'për shitje'
      }
      parts.push(statusMap[params.status] || params.status)
    }
    if (params.location) parts.push(`në ${params.location}`)
    if (params.minPrice) parts.push(`mbi €${params.minPrice}`)
    if (params.maxPrice) parts.push(`nën €${params.maxPrice}`)
    if (params.features) parts.push(...params.features)
    
    return parts.join(' ')
  }, [])

  // Handle smart search with debouncing
  useEffect(() => {
    if (activeTab === "smart" && smartSearchParams && Object.keys(smartSearchParams).length > 0) {
      setIsLoading(true)
      
      const controller = new AbortController()
      
      const performSearch = async () => {
        try {
          const response = await fetch('/api/properties/smart-search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: buildQueryFromParams(smartSearchParams) }),
            signal: controller.signal
          })
          
          if (!response.ok) throw new Error('Search failed')
          
          const data = await response.json()
          setProperties(data.properties || [])
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Smart search error:', error)
            setProperties([])
          }
        } finally {
          setIsLoading(false)
        }
      }
      
      performSearch()
      
      return () => controller.abort()
    }
  }, [smartSearchParams, activeTab, buildQueryFromParams])

  // Reset to initial properties for filters tab
  useEffect(() => {
    if (activeTab === "filters") {
      setProperties(initialProperties)
    }
  }, [activeTab, initialProperties])


  const loadingSkeleton = useMemo(() => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 h-48 rounded-xl mb-4"></div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 h-4 rounded-lg w-3/4"></div>
            <div className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 h-4 rounded-lg w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  ), [])

  if (isLoading) {
    return loadingSkeleton
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Nuk u gjetën prona që përputhen me kriteret tuaja.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <PropertyCard key={property.id} property={property} index={index} />
      ))}
    </div>
  )
})

export { PropertyListClient }