"use client"

import { useState, Suspense, useMemo } from "react"
import dynamic from "next/dynamic"
import { PropertyListSkeleton } from "@/components/property-card-skeleton"
import { SmartSearchParams } from "@/lib/smart-search"
import { PropertyForClient } from "@/types/property"

// Dynamic imports for better performance
const EnhancedSearchInterface = dynamic(
  () => import("./enhanced-search-interface").then(mod => ({ default: mod.EnhancedSearchInterface })),
  { loading: () => <div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" /> }
)

const PropertyListWrapper = dynamic(
  () => import("@/components/property-list-wrapper").then(mod => ({ default: mod.PropertyListWrapper })),
  { loading: () => <PropertyListSkeleton /> }
)

const DesktopPropertyList = dynamic(
  () => import("@/components/property-list-wrapper").then(mod => ({ default: mod.DesktopPropertyList })),
  { loading: () => <PropertyListSkeleton /> }
)

const PropertyListClient = dynamic(
  () => import("./property-list-client").then(mod => ({ default: mod.PropertyListClient })),
  { loading: () => <PropertyListSkeleton /> }
)

interface PropertiesPageClientProps {
  initialProperties: PropertyForClient[]
}

export function PropertiesPageClient({ 
  initialProperties
}: PropertiesPageClientProps) {
  const [searchResults, setSearchResults] = useState<{
    smartSearchParams?: SmartSearchParams
    activeTab: string
  }>({
    activeTab: "smart"
  })

  const handleSearchResults = useMemo(() => {
    return (results: {
      smartSearchParams?: SmartSearchParams
      activeTab: string
    }) => {
      setSearchResults(results)
    }
  }, [])

  const memoizedSearchResults = useMemo(() => searchResults, [searchResults])

  return (
    <>
      <EnhancedSearchInterface onSearchResults={handleSearchResults} />
      
      <div className="grid lg:grid-cols-1 gap-8">
        <div>
          <Suspense fallback={<PropertyListSkeleton />}>
            <DesktopPropertyList>
              <PropertyListClient 
                initialProperties={initialProperties}
                smartSearchParams={memoizedSearchResults.smartSearchParams}
                activeTab={memoizedSearchResults.activeTab}
              />
            </DesktopPropertyList>
            <PropertyListWrapper>
              <PropertyListClient 
                initialProperties={initialProperties}
                smartSearchParams={memoizedSearchResults.smartSearchParams}
                activeTab={memoizedSearchResults.activeTab}
              />
            </PropertyListWrapper>
          </Suspense>
        </div>
      </div>
    </>
  )
}