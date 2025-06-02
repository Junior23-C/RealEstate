import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Debug environment variables (without exposing sensitive data)
  const debugInfo = {
    telegram: {
      botTokenSet: !!process.env.TELEGRAM_BOT_TOKEN,
      chatIdSet: !!process.env.TELEGRAM_CHAT_ID,
      botTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0,
      chatIdLength: process.env.TELEGRAM_CHAT_ID?.length || 0
    },
    whatsapp: {
      accessTokenSet: !!process.env.WHATSAPP_ACCESS_TOKEN,
      phoneNumberIdSet: !!process.env.WHATSAPP_PHONE_NUMBER_ID
    },
    discord: {
      webhookUrlSet: !!process.env.DISCORD_WEBHOOK_URL
    },
    email: {
      resendApiKeySet: !!process.env.RESEND_API_KEY
    },
    general: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    }
  }

  return NextResponse.json(debugInfo)
}