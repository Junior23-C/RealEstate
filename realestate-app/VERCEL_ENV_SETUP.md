# Vercel Environment Variables Setup

## Step-by-Step Guide

### 1. Go to Your Vercel Project
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: **real-estate-pied-nine-85**

### 2. Navigate to Settings
1. Click on the **"Settings"** tab at the top
2. In the left sidebar, click on **"Environment Variables"**

### 3. Add Environment Variables

Add each of these variables:

#### DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: 
  ```
  postgresql://neondb_owner:npg_38YswXVMGexc@ep-delicate-grass-a9r77zyh-pooler.gwc.azure.neon.tech/neondb?sslmode=require
  ```
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://real-estate-pied-nine-85.vercel.app`
- **Environment**: ✅ Production

#### NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Generate one by running:
  ```bash
  openssl rand -base64 32
  ```
  Example: `k5H8Q2+b7w6QW3Kd9VS2mFjB9Xl5Oj8W7aBD9GVQ+pE=`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### ADMIN_EMAIL
- **Key**: `ADMIN_EMAIL`
- **Value**: `admin@aliajrealestate.com` (or your preferred email)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### ADMIN_PASSWORD
- **Key**: `ADMIN_PASSWORD`
- **Value**: Choose a strong password (e.g., `AliajAdmin2024!`)
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
1. Make sure the DATABASE_URL is copied exactly as provided
2. Check that all environment variables are set
3. Try redeploying

### If login doesn't work:
1. The admin user might not be created yet
2. Check the Vercel function logs for any errors
3. You may need to run the seed script manually

## Security Note
Never commit these environment variables to Git. They should only be stored in Vercel's environment settings.