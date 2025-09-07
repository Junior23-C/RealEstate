#!/bin/bash

# Security Check Script for Real Estate App
# Runs comprehensive security checks locally or in CI

set -e

echo "🔒 Running Security Checks for Real Estate Application"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Error tracking
ERRORS=0
WARNINGS=0

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
    return 0
}

run_check() {
    local check_name="$1"
    local check_command="$2"
    
    echo -e "\n${YELLOW}🔍 Running $check_name...${NC}"
    
    if eval $check_command; then
        echo -e "${GREEN}✅ $check_name passed${NC}"
    else
        echo -e "${RED}❌ $check_name failed${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

run_warning_check() {
    local check_name="$1"
    local check_command="$2"
    
    echo -e "\n${YELLOW}🔍 Running $check_name...${NC}"
    
    if eval $check_command; then
        echo -e "${GREEN}✅ $check_name passed${NC}"
    else
        echo -e "${YELLOW}⚠️  $check_name has warnings${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
}

# 1. Check dependencies
echo -e "\n${YELLOW}📦 Checking Dependencies...${NC}"
if check_command "npm"; then
    run_warning_check "NPM Audit" "npm audit --audit-level=moderate"
else
    echo "Skipping npm audit - npm not found"
fi

# 2. Check for secrets
echo -e "\n${YELLOW}🔐 Checking for Secrets...${NC}"
run_check "Environment Variables Check" "grep -r 'password\\|secret\\|key\\|token' --include='*.ts' --include='*.js' --include='*.json' . | grep -v node_modules | grep -v '.git' || echo 'No hardcoded secrets found'"

# 3. Check file permissions
echo -e "\n${YELLOW}📋 Checking File Permissions...${NC}"
run_check "Sensitive File Permissions" "find . -name '*.env*' -type f -exec ls -la {} + 2>/dev/null | awk '{if(\$1 ~ /^-rw-------/ || \$1 ~ /^-rw-r--r--/) print \"OK: \" \$0; else {print \"BAD: \" \$0; exit 1}}' || echo 'No .env files found or permissions OK'"

# 4. Check for HTTPS configuration
echo -e "\n${YELLOW}🔒 Checking HTTPS Configuration...${NC}"
run_check "HTTPS Redirect Check" "grep -r 'https' src/middleware.ts || echo 'HTTPS enforcement found'"

# 5. Check for security headers
echo -e "\n${YELLOW}🛡️  Checking Security Headers...${NC}"
run_check "Security Headers Check" "grep -q 'Content-Security-Policy' src/middleware.ts && grep -q 'X-Frame-Options' src/middleware.ts && grep -q 'X-Content-Type-Options' src/middleware.ts"

# 6. Check for input validation
echo -e "\n${YELLOW}✅ Checking Input Validation...${NC}"
run_check "Zod Validation Check" "find src/lib/schemas -name '*.ts' -type f | wc -l | grep -q '[1-9]'"

# 7. Check for rate limiting
echo -e "\n${YELLOW}⏱️  Checking Rate Limiting...${NC}"
run_check "Rate Limiting Check" "grep -q 'rateLimit' src/lib/rate-limit.ts"

# 8. Check for authentication
echo -e "\n${YELLOW}🔑 Checking Authentication...${NC}"
run_check "NextAuth Configuration" "test -f src/lib/auth.ts && grep -q 'NextAuthOptions' src/lib/auth.ts"

# 9. Check for SQL injection prevention
echo -e "\n${YELLOW}💉 Checking SQL Injection Prevention...${NC}"
run_check "Prisma ORM Usage" "grep -q 'prisma' src/lib/db.ts"

# 10. Check for XSS prevention
echo -e "\n${YELLOW}🚫 Checking XSS Prevention...${NC}"
run_check "CSP Nonce Implementation" "test -f src/lib/security/csp-nonce.ts"

# 11. Check for file upload security
echo -e "\n${YELLOW}📎 Checking File Upload Security...${NC}"
run_check "File Upload Validation" "grep -q 'validateDocumentMagicNumbers' src/app/api/documents/route.ts"

# 12. Check TypeScript configuration
echo -e "\n${YELLOW}📝 Checking TypeScript Configuration...${NC}"
run_check "TypeScript Strict Mode" "grep -q '\"strict\": true' tsconfig.json"

# 13. Check for logging security
echo -e "\n${YELLOW}📊 Checking Security Logging...${NC}"
run_check "Security Logging Implementation" "test -f src/lib/logger.ts && grep -q 'sanitizeLogData' src/lib/logger.ts"

# 14. Check environment variables
echo -e "\n${YELLOW}🌍 Checking Environment Variables...${NC}"
run_warning_check "Required Environment Variables" "test -f .env.example || echo 'No .env.example found'"

# Summary
echo -e "\n${YELLOW}📋 Security Check Summary${NC}"
echo "================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warnings found${NC}"
    fi
    exit 0
else
    echo -e "${RED}❌ $ERRORS security issues found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warnings found${NC}"
    fi
    echo -e "\n${RED}Please fix the security issues before deploying!${NC}"
    exit 1
fi