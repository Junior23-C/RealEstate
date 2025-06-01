import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SettingsForm } from "./settings-form"
import { prisma } from "@/lib/db"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Get current user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!user) {
    redirect("/admin/login")
  }

  // Get contact settings or create default
  let contactSettings
  try {
    contactSettings = await prisma.contactSettings.findFirst()
    
    if (!contactSettings) {
      // Create default settings if none exist
      contactSettings = await prisma.contactSettings.create({
        data: {
          businessHours: JSON.stringify({
            monday: "9:00 AM - 6:00 PM",
            tuesday: "9:00 AM - 6:00 PM",
            wednesday: "9:00 AM - 6:00 PM",
            thursday: "9:00 AM - 6:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "10:00 AM - 4:00 PM",
            sunday: "Closed"
          })
        }
      })
    }
  } catch (error) {
    console.error("Error with contact settings:", error)
    // Provide default values if database operation fails
    contactSettings = {
      id: "default",
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
    }
  }

  return <SettingsForm user={user} contactSettings={contactSettings} />
}