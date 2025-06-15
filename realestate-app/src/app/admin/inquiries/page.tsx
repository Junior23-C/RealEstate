import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { InquiryManagement } from "./inquiry-management"
import AdminLayout from "@/components/admin/admin-layout"

// Cache for 1 minute
export const revalidate = 60

export default async function AdminInquiriesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  // Optimized query with pagination
  const inquiries = await prisma.inquiry.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      status: true,
      createdAt: true,
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          state: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100 // Limit to 100 inquiries
  })

  return (
    <AdminLayout user={session.user}>
      <InquiryManagement inquiries={inquiries} />
    </AdminLayout>
  )
}