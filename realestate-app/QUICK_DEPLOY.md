# Quick Vercel Deployment Fix

## The Issue
You're getting `Environment variable not found: DATABASE_URL` because Vercel needs a PostgreSQL database connection.

## Quick Fix (2 minutes)

### Step 1: Get a Free PostgreSQL Database

**Option A: Neon (Recommended - Free)**
1. Go to [neon.tech](https://neon.tech/)
2. Sign up with GitHub
3. Create a new project
4. Copy the connection string (starts with `postgresql://`)

**Option B: Vercel Postgres**
1. In your Vercel dashboard, go to "Storage" tab
2. Click "Create Database" → "Postgres"  
3. Copy the connection string

### Step 2: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add these 3 variables:

```
DATABASE_URL = postgresql://your-connection-string-here
NEXTAUTH_SECRET = your-random-32-character-secret-key
NEXTAUTH_URL = https://your-domain.vercel.app
```

### Step 3: Redeploy

1. Click "Deployments" tab in Vercel
2. Click "..." on latest deployment
3. Click "Redeploy"

## Environment Variable Examples

```bash
# Example DATABASE_URL (replace with your actual values)
DATABASE_URL=postgresql://username:password@hostname:5432/database?sslmode=require

# Example NEXTAUTH_SECRET (generate a random 32+ character string)
NEXTAUTH_SECRET=your-super-secret-32-character-string-here

# Example NEXTAUTH_URL (replace with your actual domain)
NEXTAUTH_URL=https://your-app-name.vercel.app
```

## Generate NEXTAUTH_SECRET

You can generate a secure secret here: [generate-secret.vercel.app](https://generate-secret.vercel.app/) or run:

```bash
openssl rand -base64 32
```

## That's it! 
Your deployment should now succeed. 🚀