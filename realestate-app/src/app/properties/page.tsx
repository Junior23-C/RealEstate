"use client"

import React, { Suspense, useState, useEffect } from "react"

export const dynamic = 'force-dynamic'
import { PropertyList } from "./property-list"
import { PropertyFilters } from "./property-filters"
import { NavbarWrapper } from "@/components/navbar-wrapper"
import { Footer } from "@/components/footer"
import { FloatingFilterButton } from "@/components/floating-filter-button"
import { PropertyListSkeleton } from "@/components/property-card-skeleton"
import { PropertyListWrapper, DesktopPropertyList } from "@/components/property-list-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Calculator, SlidersHorizontal } from "lucide-react"
import { SmartSearch } from "@/components/smart-search"
import { GeolocationFinder } from "@/components/geolocation-finder"
import { CurrencyCalculator } from "@/components/currency-calculator"
import { SmartSearchParams } from "@/lib/smart-search"

interface Property {
  id: string
  title: string
  price: number
  city: string
  state: string
  latitude?: number
  longitude?: number
  distance?: number
  type: string
  status: string
  images: Array<{
    url: string
    alt?: string | null
  }>
}

interface PropertiesPageProps {
  searchParams: Promise<{
    status?: string
    type?: string
    bedrooms?: string
    bathrooms?: string
  }>
}

export default function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const [smartSearchParams, setSmartSearchParams] = useState<SmartSearchParams | undefined>()
  const [nearbyProperties, setNearbyProperties] = useState<Property[]>([])
  const [activeTab, setActiveTab] = useState("smart")
  const [params, setParams] = useState<{
    status?: string
    type?: string
    bedrooms?: string
    bathrooms?: string
  }>({})
  
  // Handle search params async loading
  useEffect(() => {
    searchParams.then(setParams)
  }, [searchParams])
  return (
    <div className="min-h-screen">
      <NavbarWrapper />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Shfletoni Pronat</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Përdorni kërkimin e mençur, gjetjen me vendndodhje, ose kalkulatorin e valutave
          </p>
        </div>

        {/* Enhanced Search Interface */}
        <div className="mb-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="smart" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Kërkim i Mençur</span>
                <span className="sm:hidden">Kërko</span>
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtrat</span>
                <span className="sm:hidden">Filtro</span>
              </TabsTrigger>
              <TabsTrigger value="nearby" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Pranë Meje</span>
                <span className="sm:hidden">Afër</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Kalkulatori</span>
                <span className="sm:hidden">Kalk</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="smart" className="p-6">
              <SmartSearch 
                onSearch={(params) => {
                  setSmartSearchParams(params)
                  setNearbyProperties([])
                  setActiveTab("smart")
                }}
              />
            </TabsContent>
            
            <TabsContent value="filters" className="p-6">
              <Suspense fallback={<div className="p-4 text-center">Duke ngarkuar filtrat...</div>}>
                <PropertyFilters />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="nearby" className="p-6">
              <GeolocationFinder 
                onPropertiesFound={(properties) => {
                  setNearbyProperties(properties)
                  setSmartSearchParams(undefined)
                  setActiveTab("nearby")
                }}
                maxDistance={15}
              />
            </TabsContent>
            
            <TabsContent value="calculator" className="p-6">
              <CurrencyCalculator 
                showPropertyCalculation={false}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="grid lg:grid-cols-1 gap-8">
          <div>
            <Suspense fallback={<PropertyListSkeleton />}>
              <DesktopPropertyList>
                <PropertyList 
                  searchParams={activeTab === "smart" || activeTab === "nearby" ? {} : params}
                  smartSearchParams={activeTab === "smart" ? smartSearchParams : undefined}
                  nearbyProperties={activeTab === "nearby" ? nearbyProperties : undefined}
                />
              </DesktopPropertyList>
              <PropertyListWrapper>
                <PropertyList 
                  searchParams={activeTab === "smart" || activeTab === "nearby" ? {} : params}
                  smartSearchParams={activeTab === "smart" ? smartSearchParams : undefined}
                  nearbyProperties={activeTab === "nearby" ? nearbyProperties : undefined}
                />
              </PropertyListWrapper>
            </Suspense>
          </div>
        </div>
      </div>
      
      {/* Floating filter button for mobile */}
      <Suspense fallback={null}>
        <FloatingFilterButton />
      </Suspense>
      
      <Footer />
    </div>
  )
}