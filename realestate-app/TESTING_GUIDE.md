# Testing Guide - Avoid Vercel Build Errors! 🚀

## Quick Test Before Pushing

Run this command to test everything:
```bash
npm run test:all
```

## Detailed Testing Steps

### 1. Test TypeScript Compilation
```bash
npx tsc --noEmit
```
This catches type errors without building.

### 2. Test Linting
```bash
npm run lint
```

### 3. Test Development Build
```bash
npm run build
```

### 4. Test Production Build
```bash
npm run test:prod
```
This uses the production schema and builds.

### 5. Test APIs (in another terminal)
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Test APIs
npm run test:apis
```

### 6. Test Pages
```bash
# With dev server running
npm run test:pages
```

## Common Issues and Fixes

### "Type 'string' is not assignable to type 'PropertyType'"
- Check that enums in seed files match schema
- Ensure prisma directory is excluded from tsconfig.json

### "Cannot find module"
- Run `npm install`
- Check import paths use @/ alias correctly

### "firstName not found"
- Ensure all models exist in both dev and prod schemas
- Run `npm run test:prod` to catch schema mismatches

### Database Connection Errors
- Don't connect to database during build
- Use `prisma db push` after deployment

## Pre-Push Checklist

- [ ] Run `npm run test:all`
- [ ] Test production build: `npm run test:prod`
- [ ] Check no hardcoded IDs in code
- [ ] Verify environment variables documented
- [ ] Test critical user flows manually

## Continuous Testing

Add to your workflow:
```bash
# Before every commit
npm run test:all

# Before pushing
npm run test:prod
```

## Setting up Git Hooks (Optional)

```bash
# Install husky
npm install --save-dev husky
npx husky init

# Add pre-push hook
echo "npm run test:prod" > .husky/pre-push
```

Now tests run automatically before pushing!