import { prisma } from "@/lib/db"

export async function getContactSettings() {
  try {
    const settings = await prisma.contactSettings.findFirst()
    
    if (!settings) {
      // Return default settings if none exist
      return {
        companyName: "Aliaj Real Estate",
        email: "info@premiumestate.com",
        phone: "(555) 123-4567",
        address: "123 Main Street",
        city: "City",
        state: "State",
        zipCode: "12345",
        businessHours: {
          monday: "9:00 AM - 6:00 PM",
          tuesday: "9:00 AM - 6:00 PM",
          wednesday: "9:00 AM - 6:00 PM",
          thursday: "9:00 AM - 6:00 PM",
          friday: "9:00 AM - 6:00 PM",
          saturday: "10:00 AM - 4:00 PM",
          sunday: "Closed"
        }
      }
    }
    
    return {
      ...settings,
      businessHours: settings.businessHours ? JSON.parse(settings.businessHours) : null
    }
  } catch (error) {
    console.error("Error fetching contact settings:", error)
    // Return defaults on error
    return {
      companyName: "Aliaj Real Estate",
      email: "info@premiumestate.com",
      phone: "(555) 123-4567",
      address: "123 Main Street",
      city: "City",
      state: "State",
      zipCode: "12345",
      businessHours: {
        monday: "9:00 AM - 6:00 PM",
        tuesday: "9:00 AM - 6:00 PM",
        wednesday: "9:00 AM - 6:00 PM",
        thursday: "9:00 AM - 6:00 PM",
        friday: "9:00 AM - 6:00 PM",
        saturday: "10:00 AM - 4:00 PM",
        sunday: "Closed"
      }
    }
  }
}