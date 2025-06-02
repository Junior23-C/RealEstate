import Link from "next/link"
import { Building2, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span className="font-bold">Aliaj Real Estate</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Partneri juaj i besuar për gjetjen e pronës perfekte. Shtëpi cilësore, shërbim i jashtëzakonshëm.
            </p>
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
                <span>Rruga Ismail Qemali, Tiranë, Shqipëri</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+355 69 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@aliaj-re.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Aliaj Real Estate. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </div>
    </footer>
  )
}