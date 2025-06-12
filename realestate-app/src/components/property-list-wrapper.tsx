"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { PullToRefresh } from "./pull-to-refresh"

interface PropertyListWrapperProps {
  children: ReactNode
}

export function PropertyListWrapper({ children }: PropertyListWrapperProps) {
  const router = useRouter()

  const handleRefresh = async () => {
    router.refresh()
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <div className="block md:hidden">
      <PullToRefresh onRefresh={handleRefresh}>
        {children}
      </PullToRefresh>
    </div>
  )
}

export function DesktopPropertyList({ children }: PropertyListWrapperProps) {
  return (
    <div className="hidden md:block">
      {children}
    </div>
  )
}