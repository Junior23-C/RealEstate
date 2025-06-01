import { useEffect, useState } from 'react'

interface ContactSettings {
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

const defaultSettings: ContactSettings = {
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

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/contact-info')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading }
}