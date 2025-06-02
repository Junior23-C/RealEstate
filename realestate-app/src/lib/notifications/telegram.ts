// Telegram Bot Integration
interface TelegramConfig {
  botToken: string
  chatId: string // Your personal chat ID
}

class TelegramService {
  private config: TelegramConfig

  constructor() {
    this.config = {
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      chatId: process.env.TELEGRAM_CHAT_ID || ''
    }
  }

  // Send a text message
  async sendMessage(message: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.config.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: this.config.chatId,
            text: message,
            parse_mode: parseMode
          })
        }
      )

      if (!response.ok) {
        console.error('Telegram API error:', await response.text())
        return false
      }

      console.log('Telegram message sent successfully')
      return true
    } catch (error) {
      console.error('Error sending Telegram message:', error)
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
      const response = await fetch(
        `https://api.telegram.org/bot${this.config.botToken}/sendPhoto`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: this.config.chatId,
            photo: photoUrl,
            caption: caption,
            parse_mode: 'HTML'
          })
        }
      )

      if (!response.ok) {
        console.error('Telegram photo error:', await response.text())
        return false
      }

      return true
    } catch (error) {
      console.error('Error sending Telegram photo:', error)
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