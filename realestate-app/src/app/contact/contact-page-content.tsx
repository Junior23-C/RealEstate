"use client"

import { motion } from "framer-motion"
import { ContactForm } from "./contact-form"
import { ContactInfo } from "./contact-info"

interface ContactPageContentProps {
  contactSettings: {
    companyName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    businessHours: {
      [key: string]: string
    }
  }
}

export function ContactPageContent({ contactSettings }: ContactPageContentProps) {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Na Kontaktoni</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Keni pyetje rreth pronave tona? Jemi këtu për t&apos;ju ndihmuar të gjeni shtëpinë tuaj perfekte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <ContactInfo contactSettings={contactSettings} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}