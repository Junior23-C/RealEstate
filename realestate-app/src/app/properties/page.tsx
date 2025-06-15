import { Suspense } from "react"
import { PropertyList } from "./property-list"
import { PropertyFilters } from "./property-filters"
import { SmartSearch } from "@/components/smart-search"
import { GeolocationFinder } from "@/components/geolocation-finder"
import { CurrencyCalculator } from "@/components/currency-calculator"
import { NavbarWrapper } from "@/components/navbar-wrapper"
import { Footer } from "@/components/footer"
import { FloatingFilterButton } from "@/components/floating-filter-button"
import { PropertyListSkeleton } from "@/components/property-card-skeleton"
import { PropertyListWrapper, DesktopPropertyList } from "@/components/property-list-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Calculator, SlidersHorizontal } from "lucide-react"

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
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Përdorni kërkimin e mençur, gjetjen me vendndodhje, ose kalkulatorin e valutave
          </p>
        </div>

        {/* Enhanced Search Interface */}
        <div className="mb-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <Tabs defaultValue="smart" className="w-full">
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
              <SmartSearch onSearch={() => {}} />
            </TabsContent>
            
            <TabsContent value="filters" className="p-6">
              <PropertyFilters />
            </TabsContent>
            
            <TabsContent value="nearby" className="p-6">
              <GeolocationFinder onPropertiesFound={() => {}} />
            </TabsContent>
            
            <TabsContent value="calculator" className="p-6">
              <CurrencyCalculator />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="grid lg:grid-cols-1 gap-8">
          <div>
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