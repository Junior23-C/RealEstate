// Email notifications with Resend
interface EmailConfig {
  apiKey: string
  fromEmail: string
  adminEmail: string
}

class EmailService {
  private config: EmailConfig

  constructor() {
    this.config = {
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.EMAIL_FROM || 'noreply@aliaj-re.com',
      adminEmail: process.env.ADMIN_EMAIL || 'admin@aliaj-re.com'
    }
  }

  // Send inquiry notification email
  async sendInquiryNotification(inquiry: {
    name: string
    email: string
    phone?: string
    message: string
    propertyTitle: string
    propertyId: string
  }): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.config.fromEmail,
          to: [this.config.adminEmail],
          subject: `🏠 Pyetje e Re: ${inquiry.propertyTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">🏠 Pyetje e Re nga Klienti</h1>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #333; margin-top: 0;">Detajet e Klientit</h2>
                  <p><strong>👤 Emri:</strong> ${inquiry.name}</p>
                  <p><strong>📧 Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
                  ${inquiry.phone ? `<p><strong>📱 Telefoni:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a></p>` : ''}
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #333; margin-top: 0;">Prona e Interesuar</h2>
                  <p><strong>🏠 Titulli:</strong> ${inquiry.propertyTitle}</p>
                  <p><strong>🔗 Linku:</strong> <a href="https://aliaj-re.com/properties/${inquiry.propertyId}" style="color: #667eea;">Shiko Pronën</a></p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px;">
                  <h2 style="color: #333; margin-top: 0;">💬 Mesazhi i Klientit</h2>
                  <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; font-style: italic;">
                    "${inquiry.message}"
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://admin.aliaj-re.com/inquiries" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    📊 Menaxho Pyetjet
                  </a>
                </div>
                
                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
                  <p>⚡ Ky njoftim u dërgua automatikisht nga sistemi i Aliaj Real Estate</p>
                </div>
              </div>
            </div>
          `,
          text: `
Pyetje e Re nga Klienti

Klienti: ${inquiry.name}
Email: ${inquiry.email}
${inquiry.phone ? `Telefoni: ${inquiry.phone}` : ''}

Prona: ${inquiry.propertyTitle}
Link: https://aliaj-re.com/properties/${inquiry.propertyId}

Mesazhi:
"${inquiry.message}"

Menaxho pyetjen: https://admin.aliaj-re.com/inquiries
          `
        })
      })

      if (!response.ok) {
        console.error('Email API error:', await response.text())
        return false
      }

      console.log('Email notification sent successfully')
      return true
    } catch (error) {
      console.error('Error sending email notification:', error)
      return false
    }
  }

  // Send auto-reply to client
  async sendAutoReply(clientEmail: string, clientName: string, propertyTitle: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.config.fromEmail,
          to: [clientEmail],
          subject: `Faleminderit për pyetjen tuaj - ${propertyTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">🏠 Aliaj Real Estate</h1>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
                <div style="background: white; padding: 20px; border-radius: 8px;">
                  <h2 style="color: #333; margin-top: 0;">Faleminderit për pyetjen tuaj!</h2>
                  
                  <p>Të nderuar ${clientName},</p>
                  
                  <p>Faleminderit që na kontaktuat për pronën <strong>"${propertyTitle}"</strong>.</p>
                  
                  <p>Pyetja juaj u mor me sukses dhe ekipi ynë do t'ju kontaktojë sa më shpejt të jetë e mundur, zakonisht brenda 2-4 orëve.</p>
                  
                  <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">📞 Për kontakt të menjëhershëm:</h3>
                    <p style="margin: 5px 0;"><strong>Telefoni:</strong> +355 69 123 4567</p>
                    <p style="margin: 5px 0;"><strong>WhatsApp:</strong> +355 69 123 4567</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> info@aliaj-re.com</p>
                  </div>
                  
                  <p>Ju faleminderit për besimin në Aliaj Real Estate!</p>
                  
                  <p style="margin-top: 30px;">
                    Me respekt,<br>
                    <strong>Ekipi i Aliaj Real Estate</strong>
                  </p>
                </div>
              </div>
            </div>
          `
        })
      })

      if (!response.ok) {
        console.error('Auto-reply email error:', await response.text())
        return false
      }

      return true
    } catch (error) {
      console.error('Error sending auto-reply email:', error)
      return false
    }
  }
}

export const emailService = new EmailService()