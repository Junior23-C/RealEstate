import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { TenantDetail } from "./tenant-detail"

interface TenantDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TenantDetailPage({ params }: TenantDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const { id } = await params
  
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      leases: {
        include: {
          property: {
            include: {
              images: {
                where: { isPrimary: true }
              }
            }
          },
          payments: {
            orderBy: { dueDate: "desc" }
          }
        },
        orderBy: { startDate: "desc" }
      }
    }
  })

  if (!tenant) {
    notFound()
  }

  return <TenantDetail tenant={tenant} />
}