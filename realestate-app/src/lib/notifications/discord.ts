// Discord Webhook Integration
interface DiscordConfig {
  webhookUrl: string
}

interface DiscordEmbed {
  title: string
  description: string
  color: number
  fields: Array<{
    name: string
    value: string
    inline: boolean
  }>
  timestamp: string
  footer: {
    text: string
  }
  thumbnail?: {
    url: string
  }
}

class DiscordService {
  private config: DiscordConfig

  constructor() {
    this.config = {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL || ''
    }
  }

  // Check if service is configured
  isConfigured(): boolean {
    return !!this.config.webhookUrl
  }

  // Send a message to Discord
  async sendMessage(content: string): Promise<boolean> {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content
        })
      })

      if (!response.ok) {
        console.error('Discord webhook error:', await response.text())
        return false
      }

      console.log('Discord message sent successfully')
      return true
    } catch (error) {
      console.error('Error sending Discord message:', error)
      return false
    }
  }

  // Send rich embed message
  async sendEmbed(inquiry: {
    name: string
    email: string
    phone?: string
    message: string
    propertyTitle: string
    propertyId: string
    propertyImageUrl?: string
  }): Promise<boolean> {
    try {
      const embed: DiscordEmbed = {
        title: "🏠 Pyetje e Re nga Klienti",
        description: `Keni marrë një pyetje të re për pronën **${inquiry.propertyTitle}**`,
        color: 0x00ff00, // Green color
        fields: [
          {
            name: "👤 Klienti",
            value: inquiry.name,
            inline: true
          },
          {
            name: "📧 Email",
            value: inquiry.email,
            inline: true
          },
          {
            name: "📱 Telefoni",
            value: inquiry.phone || "Jo i dhënë",
            inline: true
          },
          {
            name: "💬 Mesazhi",
            value: `"${inquiry.message}"`,
            inline: false
          },
          {
            name: "🔗 Linku i Pronës",
            value: `[Shiko Pronën](https://aliaj-re.com/properties/${inquiry.propertyId})`,
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Aliaj Real Estate - Sistema e Njoftimeve"
        }
      }

      if (inquiry.propertyImageUrl) {
        embed.thumbnail = {
          url: inquiry.propertyImageUrl
        }
      }

      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          embeds: [embed]
        })
      })

      if (!response.ok) {
        console.error('Discord embed error:', await response.text())
        return false
      }

      return true
    } catch (error) {
      console.error('Error sending Discord embed:', error)
      return false
    }
  }
}

export const discordService = new DiscordService()