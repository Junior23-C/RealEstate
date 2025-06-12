# Real Estate Application - Project Structure

## Overview
This is a full-featured real estate management application built with Next.js, featuring both public property listings and a comprehensive admin dashboard for property and rental management.

## Technology Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **React 19.0.0** - UI library with latest features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 11.15.0** - Animation library
- **Radix UI** - Headless UI components for accessibility
- **Lucide React 0.468.0** - Modern icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma ORM 6.1.0** - Database management and migrations
- **NextAuth.js 4.24.8** - Authentication and session management
- **bcryptjs 2.4.3** - Password hashing

### Database
- **SQLite** - Local development database
- **PostgreSQL** - Production database
- **Multiple schema configurations** for different environments

### Additional Libraries
- **React Window 1.8.10** - Virtual scrolling for performance
- **Vercel Analytics & Speed Insights** - Performance monitoring
- **Class Variance Authority** - CSS utility management
- **clsx** - Conditional CSS classes

## Project Structure

```
realestate-app/
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies and scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── next.config.ts              # Next.js configuration
│   ├── tailwind.config.ts          # Tailwind CSS customization
│   ├── eslint.config.mjs           # ESLint rules
│   ├── postcss.config.mjs          # PostCSS configuration
│   └── vercel.json                 # Vercel deployment settings
│
├── 📚 Documentation
│   ├── README.md                   # Main project documentation
│   ├── DEPLOYMENT.md               # Deployment instructions
│   ├── LOCAL_SETUP.md              # Local development setup
│   ├── VERCEL_DEPLOYMENT.md        # Vercel deployment guide
│   ├── RENTAL_SETUP.md             # Rental feature setup
│   ├── NOTIFICATION_SETUP_GUIDE.md # Notification integrations
│   ├── TESTING_GUIDE.md            # Testing procedures
│   └── ADMIN_PERFORMANCE_GUIDE.md  # Performance optimization
│
├── 🗄️ Database (prisma/)
│   ├── schema.prisma               # Main SQLite schema
│   ├── schema.prod.prisma          # Production PostgreSQL schema
│   ├── schema.dev.prisma           # Development schema
│   ├── schema.sqlite.prisma        # SQLite specific schema
│   ├── migrations/                 # SQLite migration files
│   ├── migrations-postgres/        # PostgreSQL migration files
│   ├── seed.js                     # Database seeding script
│   └── dev.db                      # Local SQLite database
│
├── 🔧 Scripts (scripts/)
│   ├── vercel-build.js            # Vercel build automation
│   ├── init-db.js                 # Database initialization
│   ├── test-all.sh                # Comprehensive test runner
│   ├── migrate-prod.js            # Production migration helper
│   └── [Various test scripts]      # Testing utilities
│
├── 🖼️ Static Assets (public/)
│   ├── uploads/properties/         # Property image uploads
│   └── [SVG icons]                 # Various SVG assets
│
└── 💻 Source Code (src/)
    ├── 🏠 Application (app/)
    │   ├── layout.tsx             # Root layout with metadata
    │   ├── page.tsx               # Homepage
    │   ├── globals.css            # Global styles and CSS variables
    │   │
    │   ├── 👨‍💼 Admin Panel (admin/)
    │   │   ├── login/             # Admin authentication pages
    │   │   ├── properties/        # Property management interface
    │   │   ├── inquiries/         # Customer inquiry management
    │   │   ├── rentals/           # Rental management system
    │   │   │   ├── leases/        # Lease agreement management
    │   │   │   └── tenants/       # Tenant management
    │   │   ├── settings/          # System settings configuration
    │   │   └── preview/           # Property preview functionality
    │   │
    │   ├── 🏘️ Properties (properties/)
    │   │   ├── [id]/              # Dynamic property detail pages
    │   │   └── page.tsx           # Property listing with filters
    │   │
    │   ├── 📞 Contact (contact/)
    │   │   └── page.tsx           # Contact form page
    │   │
    │   └── 🔗 API Routes (api/)
    │       ├── auth/              # Authentication endpoints
    │       ├── properties/        # Property CRUD operations
    │       ├── inquiries/         # Inquiry management
    │       ├── rentals/           # Rental system API
    │       ├── upload/            # File upload handling
    │       └── webhooks/          # External integrations
    │
    ├── 🧩 Components (components/)
    │   ├── ui/                    # Reusable UI components (Radix-based)
    │   ├── admin/                 # Admin-specific components
    │   ├── navbar.tsx             # Site navigation
    │   ├── footer.tsx             # Site footer
    │   ├── property-card.tsx      # Property display component
    │   ├── mobile-filter-sheet.tsx # Mobile filtering interface
    │   ├── floating-filter-button.tsx # Mobile filter button
    │   └── [Various components]   # Additional reusable components
    │
    ├── 🪝 Hooks (hooks/)
    │   ├── use-contact-settings.ts # Contact settings management
    │   └── use-debounce.ts        # Debounced input handling
    │
    ├── 📚 Libraries (lib/)
    │   ├── auth.ts                # NextAuth.js configuration
    │   ├── db.ts                  # Prisma client setup
    │   ├── cache.ts               # Caching utilities
    │   ├── utils.ts               # General utility functions
    │   └── notifications/         # Notification integrations
    │       ├── email.ts           # Email notification service
    │       ├── telegram.ts        # Telegram bot integration
    │       ├── whatsapp.ts        # WhatsApp API integration
    │       └── discord.ts         # Discord webhook integration
    │
    ├── 📝 Types (types/)
    │   ├── next-auth.d.ts         # NextAuth type extensions
    │   └── property.ts            # Property-related types
    │
    └── middleware.ts              # Next.js middleware for auth
```

## Database Schema

### Core Models
- **Property** - Real estate listings with details, pricing, and status
- **PropertyImage** - Associated property images with metadata
- **Inquiry** - Customer inquiries and lead management
- **User** - Admin user accounts and authentication
- **ContactSettings** - Company contact information and settings

### Rental Management Models
- **Tenant** - Rental tenant information and contact details
- **Lease** - Rental agreements with terms and conditions
- **Payment** - Rent payment tracking and history
- **MaintenanceRequest** - Property maintenance and repair tracking
- **Notification** - System notifications and alerts

## Key Features

### Public Interface
- **Property Browsing** - Filterable property listings with search
- **Property Details** - Comprehensive property information pages
- **Contact Forms** - Lead generation and inquiry submission
- **Mobile Responsive** - Optimized for all device sizes
- **Performance** - Optimized loading and virtual scrolling

### Admin Dashboard
- **Property Management** - Full CRUD operations for properties
- **Inquiry Tracking** - Lead management and follow-up
- **Rental Management** - Complete rental property workflow
- **Tenant Management** - Tenant information and lease tracking
- **Payment Processing** - Rent payment tracking and reporting
- **Notification System** - Multi-channel alert system
- **Settings Management** - Configurable system settings

### Integrations
- **Email Notifications** - Automated email alerts
- **WhatsApp Integration** - WhatsApp message sending
- **Telegram Notifications** - Telegram bot integration
- **Discord Notifications** - Discord webhook integration
- **File Upload** - Property image management

## Development Environment

### Multiple Database Configurations
- **Local Development** - SQLite for rapid prototyping
- **Production** - PostgreSQL for scalability
- **Environment-specific schemas** - Tailored configurations

### Build and Deployment
- **Vercel Integration** - Optimized for Vercel deployment
- **Custom Build Scripts** - Automated build processes
- **Migration Management** - Database migration utilities
- **Testing Suite** - Comprehensive testing framework

### Code Quality
- **TypeScript** - Full type safety
- **ESLint** - Code quality enforcement
- **Modern React** - Latest React 19 features
- **Component Architecture** - Reusable, maintainable components

## Development Standards

### Code Quality
- Professional code structure and organization
- Follows Next.js and React best practices
- Comprehensive error handling and validation
- Modern TypeScript implementation
- Consistent coding standards throughout

## Performance Optimizations

### Frontend Performance
- **React Window** - Virtual scrolling for large lists
- **Image Optimization** - Next.js Image component with responsive sizing
- **Code Splitting** - Automatic route-based splitting
- **Caching** - Strategic caching implementation

### Backend Performance
- **Database Indexing** - Optimized database queries
- **API Route Optimization** - Efficient data fetching
- **Static Generation** - Pre-rendered pages where applicable
- **Edge Functions** - Vercel edge deployment

## Security Features

### Authentication
- **NextAuth.js** - Secure authentication framework
- **Password Hashing** - bcryptjs for secure password storage
- **Session Management** - Secure session handling
- **Middleware Protection** - Route-level security

### Data Protection
- **Input Validation** - Comprehensive data validation
- **SQL Injection Prevention** - Prisma ORM protection
- **File Upload Security** - Secure file handling
- **Environment Variables** - Secure configuration management

## Deployment Architecture

### Vercel Platform
- **Serverless Functions** - Auto-scaling API routes
- **Edge Network** - Global CDN distribution
- **Analytics Integration** - Performance monitoring
- **Custom Build Process** - Optimized deployment pipeline

### Database Strategy
- **Multi-environment Support** - Development and production schemas
- **Migration Management** - Version-controlled database changes
- **Backup Strategy** - Data protection and recovery
- **Performance Monitoring** - Database query optimization

This real estate application represents a modern, full-stack solution with comprehensive features for both property management and public property browsing, built with industry best practices and modern web technologies.