"use client"

import { Navbar } from "./navbar"
import { useContactSettings } from "@/hooks/use-contact-settings"

export function NavbarWrapper() {
  const { settings } = useContactSettings()
  
  return <Navbar companyName={settings.companyName} />
}