"use client"

import { useState, Suspense } from "react"
import { PropertyListSkeleton } from "@/components/property-card-skeleton"
import { PropertyListWrapper, DesktopPropertyList } from "@/components/property-list-wrapper"
import { PropertyListClient } from "./property-list-client"
import { EnhancedSearchInterface } from "./enhanced-search-interface"
import { SmartSearchParams } from "@/lib/smart-search"
import { PropertyForClient } from "@/types/property"

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

  const handleSearchResults = (results: {
    smartSearchParams?: SmartSearchParams
    activeTab: string
  }) => {
    setSearchResults(results)
  }

  return (
    <>
      <EnhancedSearchInterface onSearchResults={handleSearchResults} />
      
      <div className="grid lg:grid-cols-1 gap-8">
        <div>
          <Suspense fallback={<PropertyListSkeleton />}>
            <>
              <DesktopPropertyList>
                <PropertyListClient 
                  initialProperties={initialProperties}
                  smartSearchParams={searchResults.smartSearchParams}
                  activeTab={searchResults.activeTab}
                />
              </DesktopPropertyList>
              <PropertyListWrapper>
                <PropertyListClient 
                  initialProperties={initialProperties}
                  smartSearchParams={searchResults.smartSearchParams}
                  activeTab={searchResults.activeTab}
                />
              </PropertyListWrapper>
            </>
          </Suspense>
        </div>
      </div>
    </>
  )
}