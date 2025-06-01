# Local Development Setup

## The Issue
Your local development is failing because the app now uses PostgreSQL instead of SQLite.

## Quick Fix (5 minutes)

### Option 1: Use Free Cloud PostgreSQL (Easiest)

1. **Get a free PostgreSQL database:**
   - Go to [Neon.tech](https://neon.tech)
   - Sign up with GitHub (instant, no credit card)
   - Create a new project
   - Copy the connection string

2. **Update your .env file:**
   ```bash
   DATABASE_URL="postgresql://username:password@host.neon.tech/database?sslmode=require"
   ```

3. **Run migrations:**
   ```bash
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

### Option 2: Use Docker (Local PostgreSQL)

1. **Run the setup script:**
   ```bash
   ./scripts/setup-local-db.sh
   ```

2. **This will automatically:**
   - Start PostgreSQL in Docker
   - Create your .env file
   - Set up the database

3. **Then run:**
   ```bash
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

### Option 3: Manual PostgreSQL Setup

1. **Install PostgreSQL locally**
2. **Create a database:**
   ```sql
   CREATE DATABASE realestate_dev;
   ```
3. **Update .env:**
   ```bash
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/realestate_dev"
   ```

## Troubleshooting

If you get migration errors:
```bash
# Reset and recreate migrations
npx prisma migrate reset --force
```

## That's it! 🚀
Your local development should now work with PostgreSQL.