"use client"

import { MessageCircle } from "lucide-react"
import { CONTACT_INFO, getWhatsAppLink } from "@/lib/contact-config"

export function WhatsAppButton() {
    if (!CONTACT_INFO.whatsapp) return null

    return (
        <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-all hover:bg-green-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="h-6 w-6" />
        </a>
    )
}
