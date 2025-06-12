"use client"

import { ReactNode } from "react"

interface PropertyListWrapperProps {
  children: ReactNode
}

export function PropertyListWrapper({ children }: PropertyListWrapperProps) {
  return (
    <div className="block md:hidden">
      {children}
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