"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"

interface PropertyCardSkeletonProps {
  index?: number
}

export function PropertyCardSkeleton({ index = 0 }: PropertyCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden">
        <div className="relative h-64 w-full bg-muted animate-pulse">
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-muted-foreground/20 h-7 w-20 rounded-md animate-pulse" />
            <div className="bg-muted-foreground/20 h-7 w-24 rounded-md animate-pulse" />
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            
            <div className="flex items-center gap-4 pt-2">
              <div className="h-4 bg-muted animate-pulse rounded w-16" />
              <div className="h-4 bg-muted animate-pulse rounded w-16" />
              <div className="h-4 bg-muted animate-pulse rounded w-20" />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <div className="h-10 bg-muted animate-pulse rounded w-full" />
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export function PropertyListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <PropertyCardSkeleton key={index} index={index} />
      ))}
    </div>
  )
}