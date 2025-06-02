import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { PropertyForm } from "../../property-form"
import AdminLayout from "@/components/admin/admin-layout"

interface EditPropertyPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const { id } = await params
  
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true
    }
  })

  if (!property) {
    notFound()
  }

  return (
    <AdminLayout user={session.user}>
      <PropertyForm property={property} isEdit={true} />
    </AdminLayout>
  )
}