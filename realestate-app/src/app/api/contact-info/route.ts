import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const contactSettings = await prisma.contactSettings.findFirst()
    
    if (!contactSettings) {
      // Return default settings if none exist
      return NextResponse.json({
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
      })
    }
    
    return NextResponse.json({
      ...contactSettings,
      businessHours: contactSettings.businessHours ? JSON.parse(contactSettings.businessHours) : null
    })
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact information" },
      { status: 500 }
    )
  }
}