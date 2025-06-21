"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calculator, SlidersHorizontal } from "lucide-react"
import { SmartSearch } from "@/components/smart-search"
import { CurrencyCalculator } from "@/components/currency-calculator"
import { PropertyFilters } from "./property-filters"
import { SmartSearchParams } from "@/lib/smart-search"
import { Suspense } from "react"

interface EnhancedSearchInterfaceProps {
  onSearchResults: (results: {
    smartSearchParams?: SmartSearchParams
    activeTab: string
  }) => void
}

export function EnhancedSearchInterface({ onSearchResults }: EnhancedSearchInterfaceProps) {
  const [activeTab, setActiveTab] = useState("smart")

  const handleSmartSearch = (params: SmartSearchParams) => {
    onSearchResults({
      smartSearchParams: params,
      activeTab: "smart"
    })
    setActiveTab("smart")
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "filters") {
      onSearchResults({
        smartSearchParams: undefined,
        activeTab: "filters"
      })
    }
  }

  return (
    <div className="mb-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Kalkulatori</span>
            <span className="sm:hidden">Kalk</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="smart" className="p-6">
          <SmartSearch onSearch={handleSmartSearch} />
        </TabsContent>
        
        <TabsContent value="filters" className="p-6">
          <Suspense fallback={<div className="p-4 text-center">Duke ngarkuar filtrat...</div>}>
            <PropertyFilters />
          </Suspense>
        </TabsContent>
        
        
        <TabsContent value="calculator" className="p-6">
          <CurrencyCalculator 
            showPropertyCalculation={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}