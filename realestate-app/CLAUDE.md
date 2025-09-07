# CLAUDE.md - Real Estate Application

> **This file helps Claude Code understand the project structure, workflows, and best practices for effective development assistance.**

## 📋 Project Overview

**Real Estate Management System** - A full-stack Next.js application for managing real estate properties, rentals, and inquiries.

### Tech Stack
- **Frontend**: Next.js 15.3.3, React 19, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Next.js App Router API routes, NextAuth.js authentication
- **Database**: PostgreSQL (production) / SQLite (development) with Prisma ORM
- **UI Components**: Radix UI, Lucide Icons, custom components
- **Security**: Zod validation, rate limiting, secure headers, CSRF protection
- **Deployment**: Vercel with automatic CI/CD from GitHub

## 🚀 Essential Commands

### Development
```bash
npm run dev                 # Start development server (localhost:3000)
npm run build              # Production build
npm run lint               # Run ESLint
npm run start              # Start production server
```

### Database Operations
```bash
npm run db:migrate         # Deploy database migrations
npm run db:seed           # Seed database with sample data
npm run db:setup          # Run migrations + seed (full setup)
npm run db:init           # Initialize database (custom script)
```

### Testing & Quality
```bash
npm run test:all          # Run all tests (custom script)
npm run test:apis         # Test API endpoints
npm run test:pages        # Test page rendering
npm run test:prod         # Test production build
```

### Admin Management
```bash
npm run manage-admin      # Interactive admin management
```

### Git Operations
```bash
npm run git-push          # Interactive git operations
npm run push              # Push to GitHub (shorthand)
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   │   ├── inquiries/           # Inquiry management
│   │   ├── properties/          # Property management
│   │   ├── rentals/             # Rental management
│   │   ├── settings/            # Admin settings
│   │   └── login/               # Admin login
│   ├── api/                      # API routes
│   │   ├── admin/               # Admin-specific APIs
│   │   ├── auth/[...nextauth]/  # NextAuth configuration
│   │   ├── inquiries/           # Inquiry APIs
│   │   ├── properties/          # Property APIs
│   │   ├── rentals/             # Rental management APIs
│   │   ├── upload/              # File upload API
│   │   └── webhooks/            # Webhook handlers
│   ├── contact/                  # Contact page
│   └── properties/               # Property listing pages
├── components/                   # Reusable components
│   ├── admin/                   # Admin-specific components
│   ├── ui/                      # Base UI components
│   └── [feature-components]     # Feature-specific components
├── lib/                         # Utility libraries
│   ├── schemas/                 # Zod validation schemas
│   ├── auth.ts                  # NextAuth configuration
│   ├── db.ts                    # Database connection
│   ├── logger.ts                # Secure logging utility
│   ├── rate-limit.ts            # Rate limiting system
│   └── [other-utils]            # Various utilities
└── middleware.ts                # Next.js middleware
```

## 🔐 Security Implementation (Recently Added)

### Input Validation
- **Zod schemas** in `src/lib/schemas/` for all API endpoints
- **Admin endpoints**: `admin.ts` - super admin, password change, profile
- **File uploads**: `upload.ts` - file type and content validation

### Rate Limiting
- **Implementation**: `src/lib/rate-limit.ts`
- **Login attempts**: 5 per 5 minutes
- **Super admin**: 3 attempts per hour  
- **File uploads**: 10 per 5 minutes
- **General APIs**: 100 requests per minute

### Security Headers
- **CSP**: Content Security Policy configured
- **HSTS**: HTTP Strict Transport Security
- **Anti-clickjacking**: X-Frame-Options DENY
- **MIME sniffing**: X-Content-Type-Options nosniff

### Authentication & Sessions
- **NextAuth.js**: JWT strategy with secure cookies
- **Session timeout**: 24 hours with 1-hour refresh
- **CSRF protection**: Enabled with secure tokens
- **Password requirements**: 8+ chars, uppercase, lowercase, number, special char

### Secure Logging
- **Implementation**: `src/lib/logger.ts`
- **Sensitive data**: Automatically sanitized
- **Security events**: Rate limits, invalid credentials, etc.

## 🗄️ Database Schema

### Core Tables
- **User**: Admin users with role-based access
- **Property**: Real estate listings with detailed info
- **Inquiry**: Customer inquiries for properties
- **Tenant**: Rental tenant management
- **Lease**: Rental agreements
- **Payment**: Rental payment tracking
- **Notification**: System notifications

### Key Relationships
- Properties → Inquiries (one-to-many)
- Properties → Leases (one-to-many) 
- Tenants → Leases (many-to-many)
- Leases → Payments (one-to-many)

## 🔗 API Routes

### Public APIs
- `GET /api/properties` - List properties with filtering
- `GET /api/properties/[id]` - Get single property
- `POST /api/inquiries` - Submit property inquiry
- `GET /api/exchange-rates` - Currency exchange rates
- `POST /api/properties/smart-search` - AI-powered search

### Admin APIs (Protected)
- `GET|POST /api/admin/properties` - Manage properties
- `PUT /api/admin/settings/password` - Change admin password
- `POST /api/admin/super-admin` - Super admin operations
- `POST /api/upload` - File uploads (images)
- `GET|POST /api/inquiries` - Manage inquiries

### Utility APIs
- `GET /api/health` - Health check endpoint
- `POST /api/webhooks/whatsapp` - WhatsApp integration

## 👤 Admin Panel

### Access
- **URL**: `/admin` (redirects to login if not authenticated)
- **Subdomain**: `admin.aliaj-re.com` (production)
- **Credentials**: Set via environment variables in Vercel

### Key Features
- **Dashboard**: Property stats, recent inquiries, quick actions
- **Property Management**: CRUD operations, image uploads
- **Inquiry Management**: View, respond to customer inquiries  
- **Rental Management**: Tenants, leases, payments
- **Settings**: Profile, password, system configuration

### Authentication Flow
1. Login via `/admin/login`
2. NextAuth validates credentials
3. JWT token with role stored in secure cookie
4. Middleware checks admin role for protected routes

## 🌐 Deployment

### Vercel Setup
- **GitHub Integration**: Auto-deploy on push to main
- **Environment Variables**: Set in Vercel dashboard
- **Database**: PostgreSQL (Vercel Postgres recommended)
- **Build Command**: `npm run vercel-build`

### Environment Variables Required
```bash
DATABASE_URL=postgresql://...    # Database connection
NEXTAUTH_SECRET=...             # NextAuth secret key
NEXTAUTH_URL=...                # Application URL
SUPER_ADMIN_EMAIL=...           # Super admin email
SUPER_ADMIN_PASSWORD=...        # Super admin password
```

### Build Process
1. `vercel-build` script handles schema switching
2. Prisma generates client for production
3. Next.js builds optimized static/server files
4. Vercel deploys with edge functions

## 🛠️ Development Workflow

### Starting Development
1. `npm install` - Install dependencies
2. `npm run db:setup` - Setup database with sample data
3. `npm run dev` - Start development server

### Making Changes
1. **API Changes**: Update route in `src/app/api/`
2. **Database Changes**: Create migration with Prisma
3. **UI Changes**: Update components, use existing patterns
4. **Admin Changes**: Work in `src/app/admin/` directory

### Before Committing
1. `npm run lint` - Check code quality
2. `npm run test:all` - Run all tests
3. `npm run build` - Verify build works

### Security Checklist
- ✅ Add Zod validation for new API endpoints
- ✅ Use rate limiting for sensitive operations
- ✅ Sanitize user inputs
- ✅ Use SecureLogger for error logging
- ✅ Test admin authentication

## 🔧 Common Tasks

### Adding New Property Type
1. Update Prisma schema in `prisma/schema.prisma`
2. Run `prisma migrate dev` to create migration
3. Update property form components
4. Add validation in `src/lib/schemas/`

### Adding New Admin Feature
1. Create route in `src/app/admin/[feature]/`
2. Add navigation in `admin-layout.tsx`
3. Create API endpoint in `src/app/api/admin/`
4. Add proper authentication checks

### File Upload Configuration
- **Allowed types**: JPEG, PNG, WebP
- **Max size**: 5MB
- **Validation**: MIME type + magic number checking
- **Storage**: `/public/uploads/properties/`

### Database Troubleshooting
- **Local**: Uses SQLite (`dev.db`)
- **Production**: PostgreSQL
- **Reset**: Delete `dev.db` and run `npm run db:setup`
- **Migrations**: Check `prisma/migrations/` folder

## 📝 Code Conventions

### File Naming
- **Components**: PascalCase (`PropertyCard.tsx`)
- **Pages**: lowercase (`page.tsx`, `[id]/page.tsx`)
- **API routes**: lowercase (`route.ts`)
- **Utilities**: camelCase (`auth.ts`, `rate-limit.ts`)

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Internal utilities (`@/lib/...`)
4. Components (`@/components/...`)
5. Types and interfaces

### Component Structure
```tsx
// 1. Imports
// 2. Types/Interfaces  
// 3. Main component
// 4. Default export
```

## 🚨 Important Notes

### Security Considerations
- **Never commit secrets** - use environment variables
- **Always validate input** - use Zod schemas  
- **Rate limit sensitive endpoints** - check existing patterns
- **Log security events** - use SecureLogger utility
- **Test admin authentication** - verify role-based access

### Database Considerations  
- **Local development**: SQLite for simplicity
- **Production**: PostgreSQL for features/performance
- **Schema changes**: Always create migrations
- **Seeding**: Use `prisma/seed.js` for sample data

### Performance Considerations
- **Image optimization**: Next.js Image component
- **Database queries**: Use proper indexing, avoid N+1
- **API responses**: Implement pagination where needed
- **Static generation**: Pre-render when possible

---

## 🆘 Quick Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection issues
```bash
# Check DATABASE_URL in .env.local
# For local development, should be: file:./dev.db
npm run db:setup
```

### Admin login not working
- Verify `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` in environment
- Check NextAuth configuration in `src/lib/auth.ts`
- Clear browser cookies and try again

### Build failures
```bash
npm run lint          # Fix linting errors
npm run test:prod     # Test production build
```

### Security issues
- Check rate limiting logs in console
- Verify Zod validation schemas
- Test with invalid inputs
- Check security headers in network tab

---

*This file should be updated when major architectural changes are made to help Claude Code stay current with the project structure and conventions.*