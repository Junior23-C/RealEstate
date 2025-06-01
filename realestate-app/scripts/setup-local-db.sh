#!/bin/bash

echo "Setting up local PostgreSQL database with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Stop and remove existing container if it exists
docker stop realestate-postgres 2>/dev/null
docker rm realestate-postgres 2>/dev/null

# Start PostgreSQL container
docker run --name realestate-postgres \
  -e POSTGRES_PASSWORD=localdev123 \
  -e POSTGRES_DB=realestate_dev \
  -p 5432:5432 \
  -d postgres:15

echo "Waiting for PostgreSQL to start..."
sleep 5

# Create .env file for local development
cat > .env << EOF
# Local PostgreSQL database
DATABASE_URL="postgresql://postgres:localdev123@localhost:5432/realestate_dev"

# NextAuth Configuration
NEXTAUTH_SECRET="development-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
EOF

echo "✅ Local PostgreSQL database is running!"
echo "✅ .env file created with local database URL"
echo ""
echo "Next steps:"
echo "1. Run: npm run db:migrate"
echo "2. Run: npm run db:seed"
echo "3. Run: npm run dev"