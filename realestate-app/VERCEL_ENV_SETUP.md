# Vercel Environment Variables Setup

## Step-by-Step Guide

### 1. Go to Your Vercel Project
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your Real Estate project

### 2. Navigate to Settings
1. Click on the **"Settings"** tab at the top
2. In the left sidebar, click on **"Environment Variables"**

### 3. Add Environment Variables

Add each of these variables:

#### DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Your PostgreSQL connection string from your database provider
  - **Neon**: Dashboard → Connection Details → Connection string
  - **Supabase**: Settings → Database → Connection string
  - **Vercel Postgres**: Automatically added when you create the database
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**⚠️ SECURITY WARNING**: Never commit database credentials to your repository!

#### NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: Your Vercel app URL (e.g., `https://your-app-name.vercel.app`)
- **Environment**: ✅ Production

#### NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Generate one by running:
  ```bash
  openssl rand -base64 32
  ```
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### ADMIN_EMAIL
- **Key**: `ADMIN_EMAIL`
- **Value**: Your admin email address
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### ADMIN_PASSWORD
- **Key**: `ADMIN_PASSWORD`
- **Value**: Choose a strong password
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

### 4. Save and Redeploy
1. After adding all variables, they will be automatically saved
2. Go to the **"Deployments"** tab
3. Click on the three dots (...) next to the latest deployment
4. Select **"Redeploy"**
5. Click **"Redeploy"** in the popup

### 5. Initialize Database (After Deployment)
Once deployed, you need to initialize the database:

1. Open your deployed app
2. The database tables will be created automatically on first run
3. Try logging in at `/admin/login` with your ADMIN_EMAIL and ADMIN_PASSWORD

## Troubleshooting

### If you see database connection errors:
1. Make sure the DATABASE_URL is copied exactly from your database provider
2. Check that all environment variables are set
3. Try redeploying

### If login doesn't work:
1. The admin user might not be created yet
2. Check the Vercel function logs for any errors
3. You may need to run the seed script manually

## Security Best Practices
1. **Never commit environment variables to Git**
2. **Use strong passwords**
3. **Rotate your NEXTAUTH_SECRET periodically**
4. **Keep your database credentials secure**
5. **Only share credentials through secure channels**