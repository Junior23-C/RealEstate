import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import SeedDataClient from "./seed-data-client"

export default async function SeedDataPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  return (
    <AdminLayout user={session.user}>
      <SeedDataClient />
    </AdminLayout>
  )
}