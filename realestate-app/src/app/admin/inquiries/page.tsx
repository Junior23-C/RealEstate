import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { InquiryManagement } from "./inquiry-management"

export default async function AdminInquiriesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const inquiries = await prisma.inquiry.findMany({
    include: {
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
    }
  })

  return <InquiryManagement inquiries={inquiries} />
}