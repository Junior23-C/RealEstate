# Admin Management System

This document explains how to manage admin users for your Real Estate application, including emergency access recovery.

## 🔐 **Overview**

The application has a **two-tier admin system**:
1. **Regular Admins** - Login through `/admin/login`, can be created/managed via UI
2. **Super Admin** - Emergency access system for creating/managing regular admins

## 🚀 **Quick Start**

### 1. Set Up Environment Variables

Add these to your `.env` file (both local and production):

```env
# Regular admin (created by seed script)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-password"

# Super admin (for emergency management)
SUPER_ADMIN_EMAIL="super@yourdomain.com"
SUPER_ADMIN_PASSWORD="super-secure-emergency-password"
```

### 2. Initial Setup (Local Development)

```bash
# Run database seeding (creates default admin)
npm run db:seed

# Or run individually
npm run seed
```

This will create a default admin with credentials from your environment variables.

## 🛠️ **Admin Management Commands**

### Local Development

```bash
# Create/update an admin user
npm run manage-admin create admin@example.com mypassword "Admin Name"

# Reset default admin with random password
npm run manage-admin reset

# List all admin users
npm run manage-admin list
```

### Production (Vercel/Live Site)

```bash
# Create admin on production
npm run manage-admin create admin@example.com mypassword "Admin Name" https://your-site.vercel.app

# Reset default admin on production
npm run manage-admin reset https://your-site.vercel.app

# List admins on production
npm run manage-admin list https://your-site.vercel.app
```

## 🔧 **Emergency Access Recovery**

If you're locked out of your admin panel:

### Method 1: Use Management Script

```bash
# Set your super admin credentials in environment
export SUPER_ADMIN_EMAIL="your-super@email.com"
export SUPER_ADMIN_PASSWORD="your-super-password"

# Reset admin for your live site
npm run manage-admin reset https://your-site.vercel.app
```

### Method 2: Direct API Call

```bash
# Using curl
curl -X POST https://your-site.vercel.app/api/admin/super-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-super@email.com",
    "password": "your-super-password", 
    "action": "reset_default_admin"
  }'
```

### Method 3: Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   - `SUPER_ADMIN_EMAIL`
   - `SUPER_ADMIN_PASSWORD`
3. Redeploy your application
4. Use Method 1 or 2 above

## 🔒 **Security Best Practices**

### Environment Variables
- **Never commit** `.env` files to git
- Use **different passwords** for `ADMIN_PASSWORD` and `SUPER_ADMIN_PASSWORD`
- Use **strong passwords** (minimum 12 characters, mixed case, numbers, symbols)
- Use **different email addresses** for regular admin and super admin

### Production Setup
```env
# Example secure configuration
ADMIN_EMAIL="admin@yourcompany.com"
ADMIN_PASSWORD="MySecureAdm1nP@ssw0rd2024!"
SUPER_ADMIN_EMAIL="emergency@yourcompany.com"  # Different email
SUPER_ADMIN_PASSWORD="Sup3rS3cur3Em3rg3ncy!P@ss"  # Different password
```

## 📋 **API Endpoints**

### `/api/admin/super-admin`

**Security**: Requires `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` from environment.

#### Reset Default Admin
```bash
POST /api/admin/super-admin
{
  "email": "your-super-admin-email",
  "password": "your-super-admin-password",
  "action": "reset_default_admin"
}
```

#### Create Custom Admin
```bash
POST /api/admin/super-admin
{
  "email": "your-super-admin-email",
  "password": "your-super-admin-password",
  "action": "create_admin",
  "adminEmail": "newadmin@example.com",
  "adminPassword": "newadminpassword",
  "adminName": "New Admin"
}
```

#### List All Admins
```bash
POST /api/admin/super-admin
{
  "email": "your-super-admin-email",
  "password": "your-super-admin-password",
  "action": "list_admins"
}
```

## 🚨 **Troubleshooting**

### "Super admin not configured" Error
- Check that `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` are set in your environment
- For Vercel, add them in Dashboard → Settings → Environment Variables
- Redeploy after adding environment variables

### "Invalid super admin credentials" Error
- Verify your `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` values
- Make sure there are no extra spaces or characters
- Check that environment variables are properly set in your deployment

### Can't Access Admin Panel
1. Try the emergency recovery methods above
2. Check Vercel logs for any database connection issues
3. Verify your `DATABASE_URL` is correctly configured
4. Run `npm run manage-admin list` to see existing admins

### Database Connection Issues
- Verify `DATABASE_URL` in environment variables
- For production, ensure your database service (Neon, Supabase, etc.) is accessible
- Check that database migrations have been applied

## 📝 **Regular Maintenance**

### Weekly
- Review admin user list: `npm run manage-admin list`
- Remove inactive admin accounts through the admin panel

### Monthly
- Rotate super admin password
- Update environment variables in production
- Review access logs (if available)

### After Team Changes
- Remove admin access for departing team members
- Create admin accounts for new team members
- Update contact information in admin profiles

---

**Remember**: Always keep your super admin credentials secure and separate from your regular admin credentials. This system ensures you'll never be permanently locked out of your application.