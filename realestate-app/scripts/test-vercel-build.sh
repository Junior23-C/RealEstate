#!/bin/bash
set -e

echo "Testing Vercel build process..."
echo "==============================="

# Temporarily set environment to simulate Vercel
export VERCEL=1
export DATABASE_URL="postgresql://test:test@localhost:5432/test"

# Run the vercel build script
echo "Running vercel-build script..."
npm run vercel-build

# Check if build artifacts exist
if [ -d ".next" ]; then
    echo "✅ Build successful! .next directory created"
else
    echo "❌ Build failed! .next directory not found"
    exit 1
fi

# Restore local schema
echo "Restoring local SQLite schema..."
cp prisma/schema.sqlite.prisma prisma/schema.prisma
npx prisma generate

echo "✅ Test completed successfully!"