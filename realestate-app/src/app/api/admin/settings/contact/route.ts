import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { companyName, email, phone, address, city, state, zipCode, businessHours } = body

    // Get existing contact settings
    const existingSettings = await prisma.contactSettings.findFirst()

    let contactSettings
    
    if (existingSettings) {
      // Update existing settings
      contactSettings = await prisma.contactSettings.update({
        where: { id: existingSettings.id },
        data: {
          companyName,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          businessHours
        }
      })
    } else {
      // Create new settings
      contactSettings = await prisma.contactSettings.create({
        data: {
          companyName,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          businessHours
        }
      })
    }

    return NextResponse.json({ success: true, contactSettings })
  } catch (error) {
    console.error("Error updating contact settings:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to update contact settings", details: errorMessage },
      { status: 500 }
    )
  }
}

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
        businessHours: JSON.stringify({
          monday: "9:00 AM - 6:00 PM",
          tuesday: "9:00 AM - 6:00 PM",
          wednesday: "9:00 AM - 6:00 PM",
          thursday: "9:00 AM - 6:00 PM",
          friday: "9:00 AM - 6:00 PM",
          saturday: "10:00 AM - 4:00 PM",
          sunday: "Closed"
        })
      })
    }
    
    return NextResponse.json(contactSettings)
  } catch (error) {
    console.error("Error fetching contact settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact settings" },
      { status: 500 }
    )
  }
}