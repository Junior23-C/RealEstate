"use client"

import { useState } from "react"
import { PropertyList } from "./property-list"
import { PropertyFilters } from "./property-filters"
import { SmartSearch } from "@/components/smart-search"
import { CurrencyCalculator } from "@/components/currency-calculator"
import { SmartSearchParams } from "@/lib/smart-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calculator, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Property {
  id: string
  title: string
  price: number
  city: string
  state: string
  type: string
  status: string
  images: Array<{
    url: string
    alt?: string | null
  }>
}

interface EnhancedPropertyPageProps {
  initialProperties: Property[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: any
}

export function EnhancedPropertyPage({ initialProperties, searchParams }: EnhancedPropertyPageProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [smartSearchParams, setSmartSearchParams] = useState<SmartSearchParams>({})
  const [isLoading, setIsLoading] = useState(false)
  const [searchMode, setSearchMode] = useState<'smart' | 'filters'>('smart')

  const handleSmartSearch = async (params: SmartSearchParams) => {
    if (Object.keys(params).length === 0) {
      setProperties(initialProperties)
      setSmartSearchParams({})
      return
    }

    setIsLoading(true)
    setSearchMode('smart')
    
    try {

      const response = await fetch('/api/properties/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: buildQueryFromParams(params)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties)
        setSmartSearchParams(params)
      }
    } catch (error) {
      console.error('Smart search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const buildQueryFromParams = (params: SmartSearchParams): string => {
    const parts: string[] = []
    
    if (params.bedrooms) parts.push(`${params.bedrooms} dhoma gjumi`)
    if (params.bathrooms) parts.push(`${params.bathrooms} banjo`)
    if (params.type) {
      const typeMap: Record<string, string> = {
        'APARTMENT': 'apartament',
        'HOUSE': 'shtëpi',
        'VILLA': 'vilë',
        'LAND': 'tokë',
        'COMMERCIAL': 'komerciale',
        'OFFICE': 'zyrë'
      }
      parts.push(typeMap[params.type] || params.type)
    }
    if (params.status) {
      parts.push(params.status === 'FOR_RENT' ? 'për qira' : 'për shitje')
    }
    if (params.location) parts.push(`në ${params.location}`)
    if (params.maxPrice) parts.push(`nën €${params.maxPrice}`)
    if (params.minPrice) parts.push(`mbi €${params.minPrice}`)
    if (params.features) parts.push(...params.features.map(f => f.toLowerCase()))
    
    return parts.join(' ')
  }

  const getResultsCount = () => {
    return properties.length
  }

  const getResultsText = () => {
    const count = getResultsCount()
    if (searchMode === 'smart' && Object.keys(smartSearchParams).length > 0) {
      return `${count} rezultate nga kërkimi i mençur`
    }
    return `${count} prona`
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Search Interface */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Tabs defaultValue="smart" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="smart" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Kërkim i Mençur
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrat
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Kalkulatori
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="smart" className="p-6">
            <SmartSearch onSearch={handleSmartSearch} />
          </TabsContent>
          
          <TabsContent value="filters" className="p-6">
            <PropertyFilters />
          </TabsContent>
          
          <TabsContent value="calculator" className="p-6">
            <CurrencyCalculator />
          </TabsContent>
        </Tabs>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Pronat</h2>
          <Badge variant="secondary">{getResultsText()}</Badge>
          
          {searchMode === 'smart' && Object.keys(smartSearchParams).length > 0 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Search className="h-3 w-3 mr-1" />
              Kërkim i mençur
            </Badge>
          )}
        </div>

        {(searchMode !== 'filters' && getResultsCount() > 0) && (
          <button
            onClick={() => {
              setProperties(initialProperties)
              setSmartSearchParams({})
              setSearchMode('filters')
            }}
            className="text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Pastro filtrat
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Duke kërkuar...</p>
        </div>
      )}

      {/* Properties Display */}
      {!isLoading && (
        <PropertyList
          searchParams={searchParams}
          smartSearchParams={Object.keys(smartSearchParams).length > 0 ? smartSearchParams : undefined}
        />
      )}

      {/* No Results */}
      {!isLoading && getResultsCount() === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold mb-2">Asnjë pronë nuk u gjet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Provoni të ndryshoni kriteret e kërkimit ose zgjeroni rrezin e kërkimit.
          </p>
          <button
            onClick={() => {
              setProperties(initialProperties)
              setSmartSearchParams({})
              setSearchMode('filters')
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Rikthehu tek filtrat
          </button>
        </div>
      )}
    </div>
  )
}