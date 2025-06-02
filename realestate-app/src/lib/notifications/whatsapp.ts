// WhatsApp Business API Integration
interface WhatsAppConfig {
  phoneNumberId: string
  accessToken: string
  businessPhoneNumber: string
  webhookVerifyToken: string
}

interface WhatsAppMessage {
  to: string
  type: 'text' | 'template'
  text?: {
    body: string
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: Array<{
      type: string
      parameters: Array<{
        type: string
        text: string
      }>
    }>
  }
}

class WhatsAppService {
  private config: WhatsAppConfig

  constructor() {
    this.config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      businessPhoneNumber: process.env.WHATSAPP_BUSINESS_NUMBER || '',
      webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || ''
    }
  }

  // Send a simple text message
  async sendTextMessage(to: string, message: string): Promise<boolean> {
    try {
      const payload: WhatsAppMessage = {
        to: to,
        type: 'text',
        text: {
          body: message
        }
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        console.error('WhatsApp API error:', await response.text())
        return false
      }

      console.log('WhatsApp message sent successfully')
      return true
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      return false
    }
  }

  // Send inquiry notification to admin
  async sendInquiryNotification(inquiry: {
    name: string
    email: string
    phone?: string
    message: string
    propertyTitle: string
    propertyId: string
  }): Promise<boolean> {
    const message = `🏠 *Pyetje e Re nga Klienti*

👤 *Emri:* ${inquiry.name}
📧 *Email:* ${inquiry.email}
${inquiry.phone ? `📱 *Telefoni:* ${inquiry.phone}` : ''}

🏠 *Prona:* ${inquiry.propertyTitle}
🔗 *Link:* https://aliaj-re.com/properties/${inquiry.propertyId}

💬 *Mesazhi:*
"${inquiry.message}"

⚡ Përgjigju sa më shpejt për të siguruar klientin!`

    return await this.sendTextMessage(this.config.businessPhoneNumber, message)
  }

  // Send template message (for marketing)
  async sendTemplateMessage(to: string, templateName: string, parameters: string[] = []): Promise<boolean> {
    try {
      const payload: WhatsAppMessage = {
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'sq' // Albanian
          },
          components: parameters.length > 0 ? [{
            type: 'body',
            parameters: parameters.map(param => ({
              type: 'text',
              text: param
            }))
          }] : undefined
        }
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        console.error('WhatsApp template error:', await response.text())
        return false
      }

      return true
    } catch (error) {
      console.error('Error sending WhatsApp template:', error)
      return false
    }
  }

  // Verify webhook (for receiving messages)
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config.webhookVerifyToken) {
      return challenge
    }
    return null
  }

  // Process incoming webhook
  processWebhook(body: any): void {
    try {
      if (body.entry && body.entry[0] && body.entry[0].changes) {
        const changes = body.entry[0].changes[0]
        
        if (changes.value && changes.value.messages) {
          const message = changes.value.messages[0]
          const from = message.from
          const text = message.text?.body || ''
          
          console.log(`Received WhatsApp message from ${from}: ${text}`)
          
          // Handle incoming message (e.g., auto-reply)
          this.handleIncomingMessage(from, text)
        }
      }
    } catch (error) {
      console.error('Error processing WhatsApp webhook:', error)
    }
  }

  private async handleIncomingMessage(from: string, text: string): Promise<void> {
    // Auto-reply logic
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      await this.sendTextMessage(from, 
        'Përshëndetje! Faleminderit që na kontaktuat. Si mund t\'ju ndihmojmë me pronën tuaj? 🏠'
      )
    }
  }
}

export const whatsappService = new WhatsAppService()