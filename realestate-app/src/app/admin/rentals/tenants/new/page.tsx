import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TenantForm } from "../tenant-form"

export default async function NewTenantPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  return <TenantForm />
}