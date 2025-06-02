import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { TenantForm } from "../../tenant-form"
import AdminLayout from "@/components/admin/admin-layout"

interface EditTenantPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTenantPage({ params }: EditTenantPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const { id } = await params
  
  const tenant = await prisma.tenant.findUnique({
    where: { id }
  })

  if (!tenant) {
    notFound()
  }

  return (
    <AdminLayout user={session.user}>
      <TenantForm tenant={tenant} isEdit={true} />
    </AdminLayout>
  )
}