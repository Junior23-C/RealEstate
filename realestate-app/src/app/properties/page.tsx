import { Suspense } from "react"
import { PropertyList } from "./property-list"
import { PropertyFilters } from "./property-filters"
import { NavbarWrapper } from "@/components/navbar-wrapper"
import { Footer } from "@/components/footer"
import { FloatingFilterButton } from "@/components/floating-filter-button"
import { PropertyListSkeleton } from "@/components/property-card-skeleton"
import { PropertyListWrapper, DesktopPropertyList } from "@/components/property-list-wrapper"

interface PropertiesPageProps {
  searchParams: Promise<{
    status?: string
    type?: string
    bedrooms?: string
    bathrooms?: string
  }>
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams
  return (
    <div className="min-h-screen">
      <NavbarWrapper />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Shfletoni Pronat</h1>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop filters - hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <PropertyFilters />
          </div>
          
          <div className="lg:col-span-3">
            <Suspense fallback={<PropertyListSkeleton />}>
              <DesktopPropertyList>
                <PropertyList searchParams={params} />
              </DesktopPropertyList>
              <PropertyListWrapper>
                <PropertyList searchParams={params} />
              </PropertyListWrapper>
            </Suspense>
          </div>
        </div>
      </div>
      
      {/* Floating filter button for mobile */}
      <FloatingFilterButton />
      
      <Footer />
    </div>
  )
}