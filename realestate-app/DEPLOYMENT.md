# Deployment Guide

## Quick Vercel Deployment

### 1. Set up Database

Choose one of these PostgreSQL providers:

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the connection string

#### Option B: Neon (Free Tier Available)
1. Sign up at [neon.tech](https://neon.tech/)
2. Create a new database
3. Copy the connection string

#### Option C: Supabase
1. Sign up at [supabase.com](https://supabase.com/)
2. Create a new project
3. Get the connection string from Settings > Database

### 2. Deploy to Vercel

1. **Import Project**:
   - Go to [vercel.com](https://vercel.com/)
   - Click "Import Project"
   - Connect your GitHub repository

2. **Set Environment Variables**:
   ```
   DATABASE_URL=postgresql://your-connection-string-here
   NEXTAUTH_SECRET=your-random-secret-key-32-chars-long
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically:
     - Install dependencies
     - Generate Prisma Client
     - Run database migrations
     - Build the application

### 3. Post-Deployment Setup

1. **Seed Database** (Optional):
   - Go to your Vercel project settings
   - Functions tab
   - Create a new function to seed data or do it manually

2. **Admin Access**:
   - Email: `admin@premiumestate.com`
   - Password: `admin123`
   - Or create a new admin user through the database

## Local Development with PostgreSQL

If you want to use PostgreSQL locally instead of SQLite:

1. **Install PostgreSQL**:
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   ```

2. **Create Database**:
   ```bash
   createdb realestate_dev
   ```

3. **Update Environment**:
   ```bash
   # .env
   DATABASE_URL="postgresql://username:password@localhost:5432/realestate_dev"
   ```

4. **Run Migrations**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

## Troubleshooting

### Common Issues

1. **Prisma Client Error**:
   - Solution: Make sure `postinstall` script runs `prisma generate`

2. **Database Connection Error**:
   - Check DATABASE_URL format
   - Ensure database exists and is accessible

3. **Migration Errors**:
   - Reset database: `npx prisma migrate reset`
   - Or manually run: `npx prisma db push`

4. **Build Timeouts**:
   - Upgrade Vercel plan for more build time
   - Or use `vercel-build` script instead of `build`

### Environment Variables

Make sure these are set in production:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random 32+ character string
- `NEXTAUTH_URL`: Your production domain

### Database Schema

The app automatically switches between:
- **SQLite** for local development (if using `schema.sqlite.prisma`)
- **PostgreSQL** for production (current `schema.prisma`)

## Production Checklist

- [ ] PostgreSQL database set up
- [ ] Environment variables configured
- [ ] NEXTAUTH_SECRET is secure (32+ characters)
- [ ] NEXTAUTH_URL points to production domain
- [ ] Database migrations completed
- [ ] Admin user can log in
- [ ] Sample data loaded (optional)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connection
4. Review Prisma error messages