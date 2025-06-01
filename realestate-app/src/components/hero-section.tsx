"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60 z-10" />
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="h-full w-full"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      
      <div className="container relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Discover exceptional properties for rent and sale. Your trusted partner in premium real estate.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/properties">
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}