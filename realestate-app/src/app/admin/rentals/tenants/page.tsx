import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { TenantManagement } from "./tenant-management"
import AdminLayout from "@/components/admin/admin-layout"

export default async function TenantsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const tenants = await prisma.tenant.findMany({
    include: {
      leases: {
        include: {
          property: true,
          payments: {
            where: {
              dueDate: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
              }
            },
            orderBy: { dueDate: "desc" },
            take: 1
          }
        }
      }
    },
    orderBy: { lastName: "asc" }
  })

  return (
    <AdminLayout user={session.user}>
      <TenantManagement tenants={tenants} />
    </AdminLayout>
  )
}