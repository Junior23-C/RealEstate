import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import AdminLayout from "@/components/admin/admin-layout"
import { LeaseDetailView } from "./lease-detail-view"

interface LeaseDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getLeaseDetails(id: string) {
  try {
    const lease = await prisma.lease.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            images: true
          }
        },
        tenant: true,
        payments: {
          orderBy: {
            dueDate: 'desc'
          }
        },
        leaseDocuments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!lease) {
      return null
    }

    return {
      ...lease,
      startDate: lease.startDate,
      endDate: lease.endDate,
      payments: lease.payments.map(payment => ({
        ...payment,
        dueDate: payment.dueDate,
        paidDate: payment.paidDate,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt
      })),
      leaseDocuments: lease.leaseDocuments.map(doc => ({
        ...doc,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    }
  } catch (error) {
    console.error("Error fetching lease details:", error)
    return null
  }
}

export default async function LeaseDetailPage({ params }: LeaseDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const resolvedParams = await params
  const lease = await getLeaseDetails(resolvedParams.id)
  
  if (!lease) {
    notFound()
  }

  return (
    <AdminLayout user={session.user}>
      <LeaseDetailView lease={lease} />
    </AdminLayout>
  )
}