"use client"

import { PropertyCardSkeleton, Skeleton } from "@/components/ui/loading-skeleton"

export default function PropertiesLoading() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-4">
            <Skeleton className="h-3 w-12 mb-2" />
            <Skeleton className="h-6 w-8" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}