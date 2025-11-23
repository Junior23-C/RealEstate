"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

function StatCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      setCount(Math.floor(end * percentage))

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

export function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60 z-10" />
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="h-full w-full relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600"
            alt="Beautiful modern home - Find your dream property with Aliaj Real Estate"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLYqI3LR8mptDZdF1u5uOwlstlHIdCrXN0EJxuaAAzKlT3xkBKMjfWzE2tljQ7ljxCMy6PkLqc1WJQeqKB6SHaZCc+XKTXLQ1r6HTa//Z"
          />
        </motion.div>
      </div>

      <div className="container relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Gjeni Shtëpinë e Ëndrrave në Shqipëri
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Zbuloni prona të jashtëzakonshme me qira dhe për shitje në Tiranë, Durrës dhe në të gjithë Shqipërinë. Partneri juaj i besuar në pasuritë e paluajtshme.
          </p>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-6 mb-8 p-6 bg-background/80 backdrop-blur rounded-lg border"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                <StatCounter end={500} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Prona</div>
            </div>
            <div className="text-center border-x">
              <div className="text-3xl font-bold text-primary">
                <StatCounter end={98} suffix="%" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Klientë të Kënaqur</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                <StatCounter end={10} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Vite Përvojë</div>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/properties">
                Shiko Pronat
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Na Kontaktoni</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}