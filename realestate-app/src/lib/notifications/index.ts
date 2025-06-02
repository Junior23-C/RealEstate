// Unified Notification Service
import { whatsappService } from './whatsapp'
import { telegramService } from './telegram'
import { discordService } from './discord'
import { emailService } from './email'

interface InquiryNotification {
  name: string
  email: string
  phone?: string
  message: string
  propertyTitle: string
  propertyId: string
  propertyImageUrl?: string
}

class NotificationService {
  // Send notifications to all enabled channels
  async sendInquiryNotifications(inquiry: InquiryNotification): Promise<{
    whatsapp: boolean
    telegram: boolean
    discord: boolean
    email: boolean
    autoReply: boolean
  }> {
    console.log('🔔 Sending inquiry notifications for:', inquiry.propertyTitle)

    // Send notifications in parallel for speed
    const [whatsapp, telegram, discord, email, autoReply] = await Promise.all([
      this.sendWhatsAppNotification(inquiry),
      this.sendTelegramNotification(inquiry),
      this.sendDiscordNotification(inquiry),
      this.sendEmailNotification(inquiry),
      this.sendAutoReplyEmail(inquiry)
    ])

    console.log('📊 Notification results:', { whatsapp, telegram, discord, email, autoReply })

    return { whatsapp, telegram, discord, email, autoReply }
  }

  // Individual notification methods
  private async sendWhatsAppNotification(inquiry: InquiryNotification): Promise<boolean> {
    if (!process.env.WHATSAPP_ACCESS_TOKEN) {
      console.log('⚠️ WhatsApp not configured, skipping...')
      return false
    }

    try {
      return await whatsappService.sendInquiryNotification(inquiry)
    } catch (error) {
      console.error('WhatsApp notification failed:', error)
      return false
    }
  }

  private async sendTelegramNotification(inquiry: InquiryNotification): Promise<boolean> {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.log('⚠️ Telegram not configured, skipping...')
      return false
    }

    try {
      return await telegramService.sendPropertyInquiry(inquiry)
    } catch (error) {
      console.error('Telegram notification failed:', error)
      return false
    }
  }

  private async sendDiscordNotification(inquiry: InquiryNotification): Promise<boolean> {
    if (!process.env.DISCORD_WEBHOOK_URL) {
      console.log('⚠️ Discord not configured, skipping...')
      return false
    }

    try {
      return await discordService.sendEmbed(inquiry)
    } catch (error) {
      console.error('Discord notification failed:', error)
      return false
    }
  }

  private async sendEmailNotification(inquiry: InquiryNotification): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️ Email not configured, skipping...')
      return false
    }

    try {
      return await emailService.sendInquiryNotification(inquiry)
    } catch (error) {
      console.error('Email notification failed:', error)
      return false
    }
  }

  private async sendAutoReplyEmail(inquiry: InquiryNotification): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) {
      return false
    }

    try {
      return await emailService.sendAutoReply(
        inquiry.email,
        inquiry.name,
        inquiry.propertyTitle
      )
    } catch (error) {
      console.error('Auto-reply email failed:', error)
      return false
    }
  }

  // Test all notification services
  async testNotifications(): Promise<void> {
    const testInquiry: InquiryNotification = {
      name: 'Test Klient',
      email: 'test@example.com',
      phone: '+355 69 123 4567',
      message: 'Kjo është një pyetje për test.',
      propertyTitle: 'Vila e Bukur në Tiranë',
      propertyId: 'test-123',
      propertyImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300'
    }

    console.log('🧪 Testing all notification services...')
    const results = await this.sendInquiryNotifications(testInquiry)
    
    console.log('📊 Test Results:')
    console.log(`✅ WhatsApp: ${results.whatsapp ? 'Success' : 'Failed'}`)
    console.log(`✅ Telegram: ${results.telegram ? 'Success' : 'Failed'}`)
    console.log(`✅ Discord: ${results.discord ? 'Success' : 'Failed'}`)
    console.log(`✅ Email: ${results.email ? 'Success' : 'Failed'}`)
    console.log(`✅ Auto-Reply: ${results.autoReply ? 'Success' : 'Failed'}`)
  }
}

export const notificationService = new NotificationService()

// Export individual services for specific use cases
export { whatsappService, telegramService, discordService, emailService }