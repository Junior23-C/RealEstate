# Vercel Deployment Guide

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### Database
- `DATABASE_URL` - Your PostgreSQL connection string
  ```
  postgresql://your-username:your-password@your-host/your-database?sslmode=require
  ```
  
  **⚠️ SECURITY WARNING**: Never commit your actual database credentials to git!

### Authentication
- `NEXTAUTH_URL` - Your production URL (e.g., https://real-estate-pied-nine-85.vercel.app)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

### Admin Credentials (for initial setup)
- `ADMIN_EMAIL` - Admin email for login (e.g., admin@aliajrealestate.com)
- `ADMIN_PASSWORD` - Admin password (will be hashed)

## Setup Steps

1. **Create a PostgreSQL Database**
   - Use Vercel Postgres (recommended)
   - Or use Supabase, Neon, or any PostgreSQL provider

2. **Add Environment Variables**
   - Go to your Vercel project settings
   - Add all required environment variables listed above

3. **Deploy**
   - Push to GitHub
   - Vercel will automatically build and deploy

4. **Initialize Database** (After first deployment)
   - Go to your Vercel project
   - Navigate to the Functions tab
   - Run this command in the Vercel CLI or create a one-time function:
   ```bash
   npm run db:init
   ```
   - This will create tables and seed initial data

## Database Providers

### Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. Create a new Postgres database
5. Copy the connection string

### Supabase
1. Create a project at supabase.com
2. Go to Settings > Database
3. Copy the connection string

### Neon
1. Create a project at neon.tech
2. Copy the connection string from dashboard

## Troubleshooting

If you see "Unable to open the database file" error:
- Make sure DATABASE_URL is set correctly
- Ensure it's a PostgreSQL connection string, not SQLite
- Check that the database is accessible from Vercel's servers

## Local Development

For local development, you can use SQLite:
```bash
npm run dev
```

The app will automatically use the SQLite database locally.