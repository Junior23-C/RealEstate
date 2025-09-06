"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calculator, SlidersHorizontal } from "lucide-react"
import { SmartSearch } from "@/components/smart-search"
import { CurrencyCalculator } from "@/components/currency-calculator"
import { PropertyFiltersWrapper } from "./property-filters-wrapper"
import { SmartSearchParams } from "@/lib/smart-search"

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
    <div className="mb-8 bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl backdrop-blur-sm">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-t-2xl">
          <TabsTrigger value="smart" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg transition-all duration-200 rounded-xl font-medium">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">🧠 Kërkim i Mençur</span>
            <span className="sm:hidden">Kërko</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg transition-all duration-200 rounded-xl font-medium">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">⚙️ Filtrat</span>
            <span className="sm:hidden">Filtro</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg transition-all duration-200 rounded-xl font-medium">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">💰 Kalkulatori</span>
            <span className="sm:hidden">Kalk</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="smart" className="p-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10">
          <SmartSearch onSearch={handleSmartSearch} />
        </TabsContent>
        
        <TabsContent value="filters" className="p-8 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10">
          <PropertyFiltersWrapper />
        </TabsContent>
        
        <TabsContent value="calculator" className="p-8 bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10">
          <CurrencyCalculator 
            showPropertyCalculation={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}