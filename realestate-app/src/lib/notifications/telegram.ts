// Telegram Bot Integration
interface TelegramConfig {
  botToken: string
  chatId: string // Your personal chat ID
}

class TelegramService {
  private getConfig(): TelegramConfig {
    // Get config at runtime to ensure environment variables are loaded
    return {
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      chatId: process.env.TELEGRAM_CHAT_ID || ''
    }
  }

  // Check if service is configured
  isConfigured(): boolean {
    const config = this.getConfig()
    return !!(config.botToken && config.chatId)
  }

  // Send a text message
  async sendMessage(message: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> {
    try {
      const config = this.getConfig()
      console.log('📤 Attempting to send Telegram message...')
      console.log('Chat ID:', config.chatId ? 'Set' : 'Not set')
      console.log('Bot Token:', config.botToken ? 'Set' : 'Not set')
      
      const response = await fetch(
        `https://api.telegram.org/bot${config.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: config.chatId,
            text: message,
            parse_mode: parseMode
          })
        }
      )

      const responseData = await response.json()
      
      if (!response.ok) {
        console.error('❌ Telegram API error:', responseData)
        return false
      }

      console.log('✅ Telegram message sent successfully')
      return true
    } catch (error) {
      console.error('❌ Error sending Telegram message:', error)
      return false
    }
  }

  // Send inquiry notification
  async sendInquiryNotification(inquiry: {
    name: string
    email: string
    phone?: string
    message: string
    propertyTitle: string
    propertyId: string
  }): Promise<boolean> {
    const message = `🏠 <b>Pyetje e Re nga Klienti</b>

👤 <b>Emri:</b> ${inquiry.name}
📧 <b>Email:</b> ${inquiry.email}
${inquiry.phone ? `📱 <b>Telefoni:</b> ${inquiry.phone}` : ''}

🏠 <b>Prona:</b> ${inquiry.propertyTitle}
🔗 <b>Link:</b> <a href="https://aliaj-re.com/properties/${inquiry.propertyId}">Shiko Pronën</a>

💬 <b>Mesazhi:</b>
"${inquiry.message}"

⚡ Përgjigju sa më shpejt për të siguruar klientin!`

    return await this.sendMessage(message)
  }

  // Send photo with caption
  async sendPhoto(photoUrl: string, caption: string): Promise<boolean> {
    try {
      const config = this.getConfig()
      console.log('📸 Attempting to send Telegram photo...')
      console.log('Photo URL:', photoUrl)
      
      const response = await fetch(
        `https://api.telegram.org/bot${config.botToken}/sendPhoto`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: config.chatId,
            photo: photoUrl,
            caption: caption,
            parse_mode: 'HTML'
          })
        }
      )

      const responseData = await response.json()
      
      if (!response.ok) {
        console.error('❌ Telegram photo error:', responseData)
        return false
      }

      console.log('✅ Telegram photo sent successfully')
      return true
    } catch (error) {
      console.error('❌ Error sending Telegram photo:', error)
      return false
    }
  }

  // Send property inquiry with photo
  async sendPropertyInquiry(inquiry: {
    name: string
    email: string
    phone?: string
    message: string
    propertyTitle: string
    propertyId: string
    propertyImageUrl?: string
  }): Promise<boolean> {
    // Check if service is configured
    if (!this.isConfigured()) {
      const config = this.getConfig()
      console.error('❌ Telegram service not configured properly!')
      console.error('Bot Token exists:', !!config.botToken)
      console.error('Chat ID exists:', !!config.chatId)
      console.error('Bot Token length:', config.botToken?.length || 0)
      console.error('Chat ID length:', config.chatId?.length || 0)
      return false
    }

    const caption = `🏠 <b>Pyetje për:</b> ${inquiry.propertyTitle}

👤 <b>Klienti:</b> ${inquiry.name}
📧 ${inquiry.email}
${inquiry.phone ? `📱 ${inquiry.phone}` : ''}

💬 "${inquiry.message}"

<a href="https://aliaj-re.com/properties/${inquiry.propertyId}">👆 Shiko të gjitha detajet</a>`

    if (inquiry.propertyImageUrl) {
      return await this.sendPhoto(inquiry.propertyImageUrl, caption)
    } else {
      return await this.sendMessage(caption)
    }
  }
}

export const telegramService = new TelegramService()