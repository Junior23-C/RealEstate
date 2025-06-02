import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/db'
import { notificationService } from '@/lib/notifications'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        property: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, propertyId } = body

    // Create the inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        propertyId
      },
      include: {
        property: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    })

    // Send notifications to all configured channels
    try {
      console.log('🔔 Attempting to send notifications for inquiry:', inquiry.id)
      const primaryImage = inquiry.property.images[0]
      
      const notificationData = {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone || undefined,
        message: inquiry.message,
        propertyTitle: inquiry.property.title,
        propertyId: inquiry.property.id,
        propertyImageUrl: primaryImage?.url
      }
      
      console.log('📋 Notification data:', notificationData)
      
      const results = await notificationService.sendInquiryNotifications(notificationData)
      
      console.log('✅ Notifications sent successfully for inquiry:', inquiry.id)
      console.log('📊 Notification results:', results)
    } catch (notificationError) {
      console.error('⚠️ Notification sending failed:', notificationError)
      // Don't fail the inquiry creation if notifications fail
    }

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}