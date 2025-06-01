"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-lg mb-8 opacity-90">
            Let our expert team guide you through the process
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}