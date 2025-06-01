"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

interface ContactInfoProps {
  contactSettings: {
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
}

export function ContactInfo({ contactSettings }: ContactInfoProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Office Address</p>
              <p className="text-sm text-muted-foreground">
                {contactSettings.address}<br />
                {contactSettings.city}, {contactSettings.state} {contactSettings.zipCode}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{contactSettings.phone}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{contactSettings.email}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Business Hours</p>
              <div className="text-sm text-muted-foreground space-y-1">
                {Object.entries(contactSettings.businessHours).map(([day, hours]) => (
                  <div key={day}>
                    <span className="capitalize">{day}:</span> {hours}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Choose Us?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Expert knowledge of local real estate market
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Personalized service tailored to your needs
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Transparent and honest communication
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Proven track record of successful transactions
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}