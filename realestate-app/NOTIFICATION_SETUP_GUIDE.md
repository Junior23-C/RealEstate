# 🔔 Real-Time Notification Setup Guide

This guide will help you set up instant notifications for new inquiries through WhatsApp, Telegram, Discord, and Email.

## 🚀 Quick Overview

When someone submits an inquiry on your website, you'll instantly receive notifications via:
- 📱 **WhatsApp Business** - Direct message to your business number
- 🤖 **Telegram** - Message to your personal or group chat
- 💬 **Discord** - Rich embed in your Discord server
- 📧 **Email** - Professional email with property details
- ↩️ **Auto-reply** - Automatic thank you email to the client

## 1. 📱 WhatsApp Business API Setup

### Step 1: Create Facebook Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app → Business → WhatsApp
3. Add WhatsApp product to your app

### Step 2: Get Phone Number ID and Access Token
1. In WhatsApp settings, note your **Phone Number ID**
2. Generate a **Permanent Access Token**
3. Add your business phone number

### Step 3: Environment Variables
Add to your Vercel environment variables:
```bash
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_NUMBER=your_business_whatsapp_number
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

### Step 4: Configure Webhook
1. In Facebook Developer Console → WhatsApp → Configuration
2. Set webhook URL: `https://aliaj-re.com/api/webhooks/whatsapp`
3. Set verify token (same as `WHATSAPP_WEBHOOK_VERIFY_TOKEN`)
4. Subscribe to `messages` events

## 2. 🤖 Telegram Bot Setup

### Step 1: Create Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Use `/newbot` command
3. Follow instructions to create your bot
4. Save the **Bot Token**

### Step 2: Get Your Chat ID
1. Start a chat with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YourBotToken>/getUpdates`
4. Find your **Chat ID** in the response

### Step 3: Environment Variables
```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## 3. 💬 Discord Webhook Setup

### Step 1: Create Webhook
1. Go to your Discord server
2. Server Settings → Integrations → Webhooks
3. Create New Webhook
4. Choose channel and copy webhook URL

### Step 2: Environment Variables
```bash
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

## 4. 📧 Email Setup (Resend)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up and verify your account
3. Add your domain and verify DNS records
4. Generate API key

### Step 2: Environment Variables
```bash
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@aliaj-re.com
ADMIN_EMAIL=your_email@aliaj-re.com
```

## 5. 🔧 Vercel Environment Variables Setup

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all the variables from above
3. Set them for **Production**, **Preview**, and **Development**
4. Redeploy your application

## 6. 🧪 Testing Your Notifications

### Method 1: Admin Test Endpoint
1. Go to `https://admin.aliaj-re.com/`
2. Open browser console
3. Run:
```javascript
fetch('/api/test-notifications', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

### Method 2: Submit Real Inquiry
1. Go to any property page
2. Fill out the inquiry form
3. Submit and check all your notification channels

## 7. 📋 Environment Variables Checklist

Copy this template to your Vercel environment variables:

```bash
# WhatsApp Business API (Optional)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_BUSINESS_NUMBER=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL=

# Email Notifications (Recommended)
RESEND_API_KEY=
EMAIL_FROM=noreply@aliaj-re.com
ADMIN_EMAIL=your_email@aliaj-re.com
```

## 8. 🔍 Troubleshooting

### WhatsApp Not Working?
- Check if your access token is permanent (not temporary)
- Verify phone number is properly configured
- Check webhook URL is accessible from Facebook

### Telegram Not Working?
- Ensure bot token is correct
- Check that you've started a chat with the bot
- Verify chat ID format (usually starts with `-` for groups)

### Discord Not Working?
- Check webhook URL is complete and valid
- Ensure Discord channel allows webhooks
- Verify bot permissions if using bot instead of webhook

### Email Not Working?
- Verify domain ownership in Resend
- Check API key permissions
- Ensure sender email is verified

## 9. 🚀 Advanced Features

### Custom Message Templates
Edit the notification messages in:
- `src/lib/notifications/whatsapp.ts`
- `src/lib/notifications/telegram.ts`
- `src/lib/notifications/discord.ts`
- `src/lib/notifications/email.ts`

### Notification Preferences
You can enable/disable specific channels by setting or removing environment variables.

### Auto-Reply Customization
Modify the auto-reply email template in `src/lib/notifications/email.ts` → `sendAutoReply` function.

## 10. 🔐 Security Best Practices

1. **Never commit API keys** to your repository
2. **Use environment variables** for all sensitive data
3. **Verify webhook signatures** when possible
4. **Monitor notification logs** for unusual activity
5. **Rotate tokens** periodically

## 11. 💰 Cost Estimation

- **WhatsApp Business API**: ~$0.005-0.015 per message
- **Telegram**: Free
- **Discord**: Free  
- **Resend Email**: Free tier: 3,000 emails/month

Most real estate businesses send 10-50 notifications per month, so costs are minimal.

## 12. 📞 Support

If you need help setting up notifications:

1. Check the console logs in your browser/Vercel
2. Test each service individually
3. Verify all environment variables are set correctly
4. Check the `NOTIFICATION_SETUP_GUIDE.md` troubleshooting section

---

Once set up, you'll never miss another inquiry! 🎉