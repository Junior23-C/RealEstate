"use client"

import { TableRowSkeleton, Skeleton } from "@/components/ui/loading-skeleton"

export default function InquiriesLoading() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-64" />
      </div>

      {/* Table */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-8" />
                </th>
                <th className="px-4 py-3 text-right">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {[...Array(8)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}