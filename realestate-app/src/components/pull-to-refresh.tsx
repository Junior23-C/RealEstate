"use client"

import { ReactNode, useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { RotateCcw } from "lucide-react"

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  className?: string
}

export function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number>(0)
  
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 60], [0, 1])
  const rotate = useTransform(y, [0, 60], [0, 180])
  const scale = useTransform(y, [0, 60], [0.5, 1])

  const REFRESH_THRESHOLD = 60

  useEffect(() => {
    const unsubscribe = y.on("change", (value) => {
      setCanRefresh(value >= REFRESH_THRESHOLD)
    })

    return unsubscribe
  }, [y])

  const handleDragEnd = async (event: MouseEvent | TouchEvent, info: PanInfo) => {
    setIsDragging(false)
    
    const deltaY = info.point.y - startYRef.current
    if (deltaY >= REFRESH_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        y.set(0)
      }
    } else {
      y.set(0)
    }
  }

  const handleDragStart = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    const container = containerRef.current
    if (!container) return
    
    // Only allow pull-to-refresh if we're at the top of the scroll
    if (container.scrollTop > 0) {
      return
    }
    
    setIsDragging(true)
    startYRef.current = info.point.y
  }

  const handleDrag = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    if (!isDragging) return
    
    const container = containerRef.current
    if (!container) return

    // Double-check scroll position during drag
    if (container.scrollTop > 0) {
      setIsDragging(false)
      y.set(0)
      return
    }
    
    // Only allow downward drag
    const deltaY = info.point.y - startYRef.current
    if (deltaY < 0) return

    const dragValue = Math.min(deltaY, 80)
    y.set(dragValue)
  }

  return (
    <div ref={containerRef} className={`relative overflow-auto overscroll-none touch-pan-y ${className}`}>
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex items-center justify-center w-12 h-12 bg-primary rounded-full text-primary-foreground z-10"
        style={{ 
          opacity,
          y: useTransform(y, [0, 80], [-48, 12])
        }}
      >
        <motion.div
          style={{ 
            rotate: isRefreshing ? 360 : rotate,
            scale 
          }}
          transition={isRefreshing ? { 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          } : { duration: 0.1 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.div>
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.1, bottom: 0 }}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="w-full"
        whileDrag={{ cursor: "grabbing" }}
      >
        {children}
      </motion.div>

      {(canRefresh || isRefreshing) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-sm text-muted-foreground">
          {isRefreshing ? "Duke rifreskuar..." : canRefresh ? "Lësho për të rifreskuar" : "Tërheq poshtë për të rifreskuar"}
        </div>
      )}
    </div>
  )
}