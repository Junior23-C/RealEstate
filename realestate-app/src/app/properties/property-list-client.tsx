"use client"

import { useState, useEffect } from "react"
import { PropertyCard } from "@/components/property-card"
import { SmartSearchParams } from "@/lib/smart-search"
import { PropertyForClient } from "@/types/property"

interface PropertyListClientProps {
  initialProperties: PropertyForClient[]
  smartSearchParams?: SmartSearchParams
  activeTab: string
}

export function PropertyListClient({ 
  initialProperties, 
  smartSearchParams, 
  activeTab 
}: PropertyListClientProps) {
  const [properties, setProperties] = useState<PropertyForClient[]>(initialProperties)
  const [isLoading, setIsLoading] = useState(false)

  // Handle smart search
  useEffect(() => {
    if (activeTab === "smart" && smartSearchParams && Object.keys(smartSearchParams).length > 0) {
      setIsLoading(true)
      fetch('/api/properties/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: buildQueryFromParams(smartSearchParams) })
      })
      .then(res => res.json())
      .then(data => {
        setProperties(data.properties || [])
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Smart search error:', error)
        setProperties([])
        setIsLoading(false)
      })
    }
  }, [smartSearchParams, activeTab])

  // Reset to initial properties for filters tab
  useEffect(() => {
    if (activeTab === "filters") {
      setProperties(initialProperties)
    }
  }, [activeTab, initialProperties])

  function buildQueryFromParams(params: SmartSearchParams): string {
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
  }

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-3/4"></div>
              <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
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
}