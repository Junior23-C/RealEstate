import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, propertyId } = body

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        propertyId
      }
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}