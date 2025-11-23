/**
 * Centralized Contact Information
 * 
 * This is the single source of truth for all contact information across the site.
 * Update these values to change contact info site-wide.
 */

export const CONTACT_INFO = {
    phone: "+355 69 123 4567",
    whatsapp: "+355 69 123 4567",
    email: "info@aliaj-re.com",
    address: "Rruga Ismail Qemali, Tiranë, Shqipëri",
    city: "Tiranë",
    country: "Shqipëri",
    businessHours: "E Hënë - E Shtunë: 9:00 - 18:00",
    social: {
        facebook: "https://facebook.com/aliajrealestate",
        instagram: "https://instagram.com/aliajrealestate",
    }
} as const

export const COMPANY_INFO = {
    name: "Aliaj Real Estate",
    tagline: "Partneri juaj i besuar në pasuritë e paluajtshme",
    description: "Zbuloni prona të jashtëzakonshme me qira dhe për shitje në Tiranë, Durrës dhe në të gjithë Shqipërinë.",
    yearFounded: 2014,
} as const

// Helper function to get WhatsApp link with pre-filled message
export function getWhatsAppLink(propertyTitle?: string) {
    const message = propertyTitle
        ? `Përshëndetje! Jam i interesuar për pronën: ${propertyTitle}`
        : "Përshëndetje! Dëshiroj të marr më shumë informacion rreth pronave tuaja."

    return `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
}
