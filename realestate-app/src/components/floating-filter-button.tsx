"use client"

import { useState, useEffect } from "react"
import { MobileFilterSheet } from "./mobile-filter-sheet"
import { cn } from "@/lib/utils"

interface FloatingFilterButtonProps {
  totalProperties?: number
}

export function FloatingFilterButton({ totalProperties }: FloatingFilterButtonProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show button when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide button when scrolling down
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 z-40 transition-all duration-300 lg:hidden",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}
    >
      <MobileFilterSheet totalProperties={totalProperties} />
    </div>
  )
}