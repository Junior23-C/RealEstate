import Link from "next/link"
import { Building2, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react"
import { CONTACT_INFO, COMPANY_INFO } from "@/lib/contact-config"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span className="font-bold">{COMPANY_INFO.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {COMPANY_INFO.tagline}
            </p>
            <div className="flex space-x-4">
              <Link
                href={CONTACT_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href={CONTACT_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Lidhje të Shpejta</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-foreground">
                  Shiko Pronat
                </Link>
              </li>
              <li>
                <Link href="/properties?status=FOR_RENT" className="text-muted-foreground hover:text-foreground">
                  Me Qira
                </Link>
              </li>
              <li>
                <Link href="/properties?status=FOR_SALE" className="text-muted-foreground hover:text-foreground">
                  Për Shitje
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Na Kontaktoni
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Llojet e Pronave</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?type=HOUSE" className="text-muted-foreground hover:text-foreground">
                  Shtëpi
                </Link>
              </li>
              <li>
                <Link href="/properties?type=APARTMENT" className="text-muted-foreground hover:text-foreground">
                  Apartamente
                </Link>
              </li>
              <li>
                <Link href="/properties?type=CONDO" className="text-muted-foreground hover:text-foreground">
                  Kondominiume
                </Link>
              </li>
              <li>
                <Link href="/properties?type=COMMERCIAL" className="text-muted-foreground hover:text-foreground">
                  Komerciale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Informacioni i Kontaktit</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-foreground transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-foreground transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </div>
    </footer>
  )
}