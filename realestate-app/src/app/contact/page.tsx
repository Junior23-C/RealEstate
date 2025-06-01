import { NavbarWrapper } from "@/components/navbar-wrapper"
import { Footer } from "@/components/footer"
import { getContactSettings } from "@/lib/contact-settings"
import { ContactPageContent } from "./contact-page-content"

export default async function ContactPage() {
  const contactSettings = await getContactSettings()

  return (
    <div className="min-h-screen">
      <NavbarWrapper />
      <ContactPageContent contactSettings={contactSettings} />
      <Footer />
    </div>
  )
}