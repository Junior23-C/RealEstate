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
    // First try with leaseDocuments
    let lease
    try {
      lease = await prisma.lease.findUnique({
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
    } catch (relationError) {
      console.warn("leaseDocuments relation not available, falling back to basic query", relationError)
      // Fallback: query without leaseDocuments if the relation doesn't exist yet
      lease = await prisma.lease.findUnique({
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
          }
        }
      })
    }

    if (!lease) {
      return null
    }

    const result = {
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
      leaseDocuments: [] as Array<{
        id: string
        filename: string
        originalName: string
        fileSize: number
        mimeType: string
        url: string
        type: string
        description?: string | null
        uploadedBy: string
        createdAt: Date
        updatedAt: Date
      }>
    }

    // Add leaseDocuments if they exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ('leaseDocuments' in lease && Array.isArray((lease as any).leaseDocuments)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.leaseDocuments = (lease as any).leaseDocuments.map((doc: any) => ({
        ...doc,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    }

    return result
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