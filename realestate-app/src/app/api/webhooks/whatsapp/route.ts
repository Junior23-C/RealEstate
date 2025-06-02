import { NextRequest, NextResponse } from 'next/server'
import { whatsappService } from '@/lib/notifications/whatsapp'

// Webhook verification (GET)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.log('WhatsApp webhook verification:', { mode, token, challenge })

  if (mode && token && challenge) {
    const result = whatsappService.verifyWebhook(mode, token, challenge)
    
    if (result) {
      console.log('✅ WhatsApp webhook verified successfully')
      return new NextResponse(result, { status: 200 })
    } else {
      console.log('❌ WhatsApp webhook verification failed')
      return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

// Webhook events (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📱 WhatsApp webhook received:', JSON.stringify(body, null, 2))
    
    // Process the webhook
    whatsappService.processWebhook(body)
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}