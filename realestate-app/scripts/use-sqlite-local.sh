#!/bin/bash

echo "Setting up SQLite for local development..."

# Backup current schema
cp prisma/schema.prisma prisma/schema.prod.prisma

# Use SQLite schema
cp prisma/schema.dev.prisma prisma/schema.prisma

# Update .env for SQLite
cat > .env << EOF
# Local SQLite database (for development only)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="development-secret-please-change"
NEXTAUTH_URL="http://localhost:3000"
EOF

echo "✅ Switched to SQLite for local development"
echo ""
echo "Now run:"
echo "1. npx prisma generate"
echo "2. npx prisma migrate dev --name init"
echo "3. npm run seed"
echo "4. npm run dev"