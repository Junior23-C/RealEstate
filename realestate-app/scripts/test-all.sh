#!/bin/bash

echo "🧪 Starting comprehensive tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 passed${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

echo -e "\n${YELLOW}1. Checking dependencies...${NC}"
npm list --depth=0 > /dev/null 2>&1
check_status "Dependencies check"

echo -e "\n${YELLOW}2. Running TypeScript compilation...${NC}"
npx tsc --noEmit
check_status "TypeScript compilation"

echo -e "\n${YELLOW}3. Running ESLint...${NC}"
npm run lint
check_status "ESLint"

echo -e "\n${YELLOW}4. Testing development build...${NC}"
npm run build
check_status "Development build"

echo -e "\n${YELLOW}5. Testing production schema...${NC}"
cp prisma/schema.prod.prisma prisma/schema.prisma
npx prisma generate
check_status "Production schema generation"

echo -e "\n${YELLOW}6. Testing production build...${NC}"
npm run build
check_status "Production build"

echo -e "\n${YELLOW}7. Checking for unused dependencies...${NC}"
npx depcheck
check_status "Dependency check"

echo -e "\n${YELLOW}8. Restoring development schema...${NC}"
cp prisma/schema.dev.prisma prisma/schema.prisma 2>/dev/null || cp prisma/schema.sqlite.prisma prisma/schema.prisma 2>/dev/null
npx prisma generate
check_status "Development schema restoration"

echo -e "\n${GREEN}✅ All tests passed!${NC}"
echo "Your app is ready for deployment! 🚀"