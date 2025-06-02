import { Suspense } from "react"
import { PropertyList } from "./property-list"
import { PropertyFilters } from "./property-filters"
import { NavbarWrapper } from "@/components/navbar-wrapper"
import { Footer } from "@/components/footer"

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
        <h1 className="text-4xl font-bold mb-8">Shfletoni Pronat</h1>
        
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <PropertyFilters />
          </div>
          
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Duke ngarkuar pronat...</div>}>
              <PropertyList searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}