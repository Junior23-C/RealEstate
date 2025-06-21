"use client"

import { Suspense } from "react"
import { PropertyFilters } from "./property-filters"

export function PropertyFiltersWrapper() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Duke ngarkuar filtrat...</div>}>
      <PropertyFilters />
    </Suspense>
  )
}