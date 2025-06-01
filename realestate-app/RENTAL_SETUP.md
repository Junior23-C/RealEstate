# 🏠 Rental Management System Setup

Your real estate application now includes a comprehensive rental management system with payment tracking, tenant management, and automated notifications.

## 🚀 Features

### 📊 Rental Dashboard
- **Statistics Overview**: Active leases, monthly revenue, expiring leases, overdue payments
- **Recent Payments**: Track all payments with status indicators
- **Upcoming Payments**: Monitor due dates and payment schedules
- **Active Leases**: View all current rental agreements

### 👥 Tenant Management
- **Tenant Profiles**: Store detailed tenant information including contact details, employment, emergency contacts
- **Lease Tracking**: Monitor lease periods, rental amounts, and terms
- **Payment History**: Complete payment tracking with due dates and status
- **Search & Filter**: Easily find tenants by name, email, or phone

### 💰 Payment Tracking
- **Payment Status**: PENDING, PAID, OVERDUE, PARTIAL
- **Due Date Monitoring**: Automatic status updates for overdue payments
- **Payment Methods**: Track payment methods (cash, check, bank transfer, online)
- **Late Fee Tracking**: Monitor and track late fees

### 🔔 Automated Notifications
- **Rent Reminders**: 3 days before due date
- **Overdue Alerts**: Daily notifications for overdue payments
- **Lease Expiration**: Alerts for expiring leases
- **Email Integration**: Ready for email service integration

## 🛠️ Setup Instructions

### 1. Database Migration
The database schema has been updated automatically. If you need to reset:

```bash
cd realestate-app
npx prisma migrate reset
npx prisma migrate dev
```

### 2. Access the Rental Dashboard
1. Go to your admin panel: `/admin`
2. Click on **"Rental Dashboard"** or navigate to `/admin/rentals`
3. Explore the three main sections:
   - **Overview**: Statistics and recent activity
   - **Active Leases**: Manage current rentals
   - **Payments**: Track payment schedules

### 3. Set Up Automated Notifications (FREE Options)

#### Option A: GitHub Actions (Recommended - FREE)
Create `.github/workflows/payment-reminders.yml`:

```yaml
name: Payment Reminders
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM
  workflow_dispatch:  # Manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Send Payment Reminders
        run: |
          curl -X GET "https://your-domain.vercel.app/api/cron/payment-reminders" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

#### Option B: cron-job.org (FREE)
1. Go to [cron-job.org](https://cron-job.org)
2. Create a free account
3. Add a new cron job:
   - **URL**: `https://your-domain.vercel.app/api/cron/payment-reminders`
   - **Schedule**: Daily at 9:00 AM
   - **HTTP Method**: GET
   - **Headers**: `Authorization: Bearer your-secret-key`

#### Option C: Manual Testing
Test the notification system manually:
```bash
curl -X GET "https://your-domain.vercel.app/api/cron/payment-reminders" \
  -H "Authorization: Bearer your-secret-key"
```

### 4. Environment Variables
Add to your `.env.local`:

```env
# Cron job security
CRON_SECRET=your-secret-key-here

# Email service (optional - for actual email sending)
# Choose one of these services:

# Option 1: Resend (Recommended - Free tier)
RESEND_API_KEY=your-resend-api-key

# Option 2: SendGrid (Free tier)
SENDGRID_API_KEY=your-sendgrid-api-key

# Option 3: Nodemailer with Gmail (Free)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### 5. Email Integration (Optional)
To actually send emails, integrate with a free email service:

#### Resend (Recommended)
```bash
npm install resend
```

Add to `src/lib/email.ts`:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: 'noreply@your-domain.com',
    to,
    subject,
    html
  })
}
```

## 📱 Getting Notifications on Your Phone

### Option 1: Email Notifications
Set up email forwarding to your phone or use your email app for instant notifications.

### Option 2: Webhook to Phone (Advanced)
Use services like:
- **IFTTT** (If This Then That) - Free
- **Zapier** - Free tier available
- **Discord/Slack webhooks** - Free

Example with Discord:
1. Create a Discord server
2. Create a webhook in your channel
3. Modify the notification API to send to Discord

### Option 3: SMS (Paid but cheap)
Integrate with:
- **Twilio** - Pay per SMS (~$0.01 per message)
- **MessageBird** - Similar pricing
- **AWS SNS** - Very cheap SMS service

## 🏗️ Managing Tenants and Leases

### Adding a New Tenant
1. Go to `/admin/rentals/tenants`
2. Click "Add Tenant"
3. Fill in tenant information:
   - Personal details (name, email, phone, DOB)
   - Employment information
   - Emergency contacts
   - Notes

### Creating a Lease
1. Navigate to rental dashboard
2. Click "New Lease"
3. Select property and tenant
4. Set lease terms:
   - Start and end dates
   - Monthly rent amount
   - Security deposit
   - Due date (day of month)
   - Late fees

### Payment Tracking
- Payments are automatically generated based on lease terms
- Mark payments as paid when received
- System automatically tracks overdue payments
- Late fees can be added as needed

## 📊 Reports and Analytics

The system provides insights on:
- **Monthly Revenue**: Total from all active leases
- **Payment Patterns**: On-time vs. late payments
- **Tenant History**: Payment history per tenant
- **Property Performance**: Revenue per property
- **Occupancy Rates**: Active vs. available properties

## 🔐 Security Features

- **Admin Authentication**: Only admins can access rental management
- **Secure Cron Endpoints**: Protected with secret keys
- **Data Validation**: All inputs are validated and sanitized
- **Audit Trail**: All changes are timestamped and tracked

## 🆘 Troubleshooting

### Notifications Not Working
1. Check that CRON_SECRET is set correctly
2. Verify the cron job URL is accessible
3. Check the API logs in Vercel dashboard
4. Test manually: `/api/cron/payment-reminders`

### Database Issues
```bash
# Reset and regenerate database
npx prisma migrate reset
npx prisma db push
npx prisma generate
```

### Payment Tracking Issues
1. Ensure lease dates are set correctly
2. Check that monthly rent amounts are positive numbers
3. Verify rent due day is between 1-31

## 📞 Support

If you need help setting up any of these features:
1. Check the application logs in Vercel
2. Test API endpoints manually
3. Verify environment variables are set
4. Check database connections

The rental management system is now fully integrated and ready to help you manage your properties efficiently! 🎉