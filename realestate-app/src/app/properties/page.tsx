import { Suspense } from "react"
import { PropertyList } from "./property-list"
import { PropertyFilters } from "./property-filters"
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
              <div className="space-y-4">
                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                  <Search className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Kërkim i Mençur</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Kërkoni me gjuhë natyrale në shqip ose anglisht
                  </p>
                  <div className="text-sm text-slate-500 space-y-1">
                    <div>Shembuj: &quot;2 dhoma gjumi në Tiranë nën €100k&quot;</div>
                    <div>&quot;Apartament për qira pranë detit&quot;</div>
                    <div>&quot;Vilë me pishina mbi €200k&quot;</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="filters" className="p-6">
              <PropertyFilters />
            </TabsContent>
            
            <TabsContent value="nearby" className="p-6">
              <div className="space-y-4">
                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                  <MapPin className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Pronat Pranë Jush</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Gjeni pronat më të afërta duke përdorur vendndodhjen tuaj
                  </p>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
                    Aktivizo vendndodhjen
                  </button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="calculator" className="p-6">
              <div className="space-y-4">
                <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl">
                  <Calculator className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Kalkulator Valutash</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Konvertoni çmimet midis EUR dhe LEK me kurse të azhurnuara
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">€108.5</div>
                      <div className="text-sm text-slate-500">1 EUR</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">LEK</div>
                      <div className="text-sm text-slate-500">Këmbim real</div>
                    </div>
                  </div>
                </div>
              </div>
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