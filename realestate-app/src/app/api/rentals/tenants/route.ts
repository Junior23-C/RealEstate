import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        leases: {
          include: {
            property: true,
            payments: {
              orderBy: { dueDate: "desc" },
              take: 5
            }
          }
        }
      },
      orderBy: { lastName: "asc" }
    })

    return NextResponse.json(tenants)
  } catch (error) {
    console.error("Error fetching tenants:", error)
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      ssn,
      emergencyContact,
      emergencyPhone,
      employer,
      monthlyIncome,
      notes
    } = body

    const tenant = await prisma.tenant.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        ssn,
        emergencyContact,
        emergencyPhone,
        employer,
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        notes
      }
    })

    return NextResponse.json({ success: true, tenant })
  } catch (error) {
    console.error("Error creating tenant:", error)
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    )
  }
}