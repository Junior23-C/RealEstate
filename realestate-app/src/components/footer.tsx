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
              Your trusted partner in finding the perfect property. Quality homes, exceptional service.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-foreground">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?status=FOR_RENT" className="text-muted-foreground hover:text-foreground">
                  For Rent
                </Link>
              </li>
              <li>
                <Link href="/properties?status=FOR_SALE" className="text-muted-foreground hover:text-foreground">
                  For Sale
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?type=HOUSE" className="text-muted-foreground hover:text-foreground">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=APARTMENT" className="text-muted-foreground hover:text-foreground">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=CONDO" className="text-muted-foreground hover:text-foreground">
                  Condos
                </Link>
              </li>
              <li>
                <Link href="/properties?type=COMMERCIAL" className="text-muted-foreground hover:text-foreground">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact Info</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Main Street, City, State 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@premiumestate.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Aliaj Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}