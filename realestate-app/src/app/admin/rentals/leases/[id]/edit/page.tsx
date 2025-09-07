import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import AdminLayout from "@/components/admin/admin-layout"
import { LeaseEditForm } from "./lease-edit-form"

interface LeaseEditPageProps {
  params: Promise<{
    id: string
  }>
}

async function getLeaseData(id: string) {
  try {
    const lease = await prisma.lease.findUnique({
      where: { id },
      include: {
        property: true,
        tenant: true
      }
    })

    if (!lease) {
      return null
    }

    // Get available properties and tenants for the form
    const [availableProperties, tenants] = await Promise.all([
      prisma.property.findMany({
        where: {
          OR: [
            { status: 'FOR_RENT' },
            { status: 'FOR_SALE' }
          ]
        },
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
        }
      }),
      prisma.tenant.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        },
        orderBy: {
          firstName: 'asc'
        }
      })
    ])

    // Include current property and tenant even if not available
    const allProperties = [
      ...availableProperties,
      ...(availableProperties.find(p => p.id === lease.propertyId) ? [] : [{
        id: lease.property.id,
        title: lease.property.title,
        address: lease.property.address,
        city: lease.property.city,
        state: lease.property.state,
        bedrooms: lease.property.bedrooms,
        bathrooms: lease.property.bathrooms,
        squareFeet: lease.property.squareFeet,
        price: lease.property.price
      }])
    ]

    return {
      lease: {
        ...lease,
        startDate: lease.startDate,
        endDate: lease.endDate
      },
      availableProperties: allProperties,
      tenants
    }
  } catch (error) {
    console.error("Error fetching lease data:", error)
    return null
  }
}

export default async function LeaseEditPage({ params }: LeaseEditPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const resolvedParams = await params
  const data = await getLeaseData(resolvedParams.id)
  
  if (!data) {
    notFound()
  }

  return (
    <AdminLayout user={session.user}>
      <LeaseEditForm 
        lease={data.lease}
        availableProperties={data.availableProperties}
        tenants={data.tenants}
      />
    </AdminLayout>
  )
}