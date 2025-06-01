import { notFound } from "next/navigation"
import { PropertyDetail } from "./property-detail"
import { prisma } from "@/lib/db"
import { NavbarWrapper } from "@/components/navbar-wrapper"
import { Footer } from "@/components/footer"

interface PropertyPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
      _count: {
        select: { inquiries: true }
      }
    }
  })

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <NavbarWrapper />
      <PropertyDetail property={property} />
      <Footer />
    </div>
  )
}