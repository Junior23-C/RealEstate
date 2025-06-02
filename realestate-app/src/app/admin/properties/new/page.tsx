import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PropertyForm } from "../property-form"
import AdminLayout from "@/components/admin/admin-layout"

export default async function NewPropertyPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  return (
    <AdminLayout user={session.user}>
      <PropertyForm />
    </AdminLayout>
  )
}