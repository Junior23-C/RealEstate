import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { LeaseForm } from "../lease-form"

export default async function NewLeasePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Get available properties (FOR_RENT status)
  const availableProperties = await prisma.property.findMany({
    where: { status: "FOR_RENT" },
    select: {
      id: true,
      title: true,
      address: true,
      city: true,
      state: true,
      bedrooms: true,
      bathrooms: true,
      squareFeet: true,
      price: true
    },
    orderBy: { title: "asc" }
  })

  // Get all tenants
  const tenants = await prisma.tenant.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true
    },
    orderBy: { lastName: "asc" }
  })

  return <LeaseForm availableProperties={availableProperties} tenants={tenants} />
}