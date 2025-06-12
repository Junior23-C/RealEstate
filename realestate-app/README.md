# Premium Real Estate Platform

A modern, full-featured real estate management system built with Next.js 15, TypeScript, and Prisma. Features a beautiful public-facing website for property browsing and a comprehensive admin dashboard for property and rental management.

## 🌟 Overview

This application provides a complete solution for real estate businesses, offering both public property listings and a comprehensive management system for properties, inquiries, rentals, and tenant relationships.

## 🚀 Features

### Public Website
- **Property Browsing**: Advanced filtering by type, status, price range, bedrooms, bathrooms
- **Property Details**: Comprehensive property information with image galleries
- **Inquiry System**: Property-specific and general contact forms
- **Mobile Responsive**: Optimized experience across all devices
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Search Functionality**: Full-text search across properties

### Admin Dashboard
- **Secure Authentication**: Role-based access control with NextAuth.js
- **Property Management**: Complete CRUD operations for property listings
- **Inquiry Management**: Track and manage customer inquiries with status updates
- **Rental Management**: Full rental lifecycle management
- **Tenant Management**: Track tenant information and lease agreements
- **Payment Tracking**: Monitor rent payments and maintenance requests
- **Notification System**: Multi-channel notifications (Email, WhatsApp, Telegram, Discord)
- **Analytics Dashboard**: Property statistics and performance metrics
- **Image Management**: Multiple property images with drag-and-drop upload
- **Bulk Operations**: Manage multiple properties efficiently

### Rental Management System
- **Lease Management**: Create and track rental agreements
- **Tenant Profiles**: Comprehensive tenant information management
- **Payment Tracking**: Monitor rent payments and overdue amounts
- **Maintenance Requests**: Track property maintenance and repairs
- **Automated Notifications**: Rent reminders and overdue payment alerts
- **Financial Reporting**: Revenue tracking and payment history

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 3.4.17 with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: Framer Motion 11.15.0
- **Icons**: Lucide React
- **State Management**: React hooks and server state

### Backend
- **API**: Next.js API Routes with middleware
- **Authentication**: NextAuth.js 4.24.8 with JWT strategy
- **Database**: Prisma ORM 6.1.0 with multiple schema support
- **File Upload**: Custom image upload handling
- **Notifications**: Multi-service integration

### Database
- **Development**: SQLite for local development
- **Production**: PostgreSQL for scalability
- **ORM**: Prisma with type-safe queries
- **Migrations**: Version-controlled schema management

### DevOps & Deployment
- **Platform**: Vercel deployment with automatic builds
- **Analytics**: Vercel Analytics and Speed Insights
- **Monitoring**: Built-in health checks and error tracking
- **Security**: Environment-based configuration

## 📋 System Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Memory**: 2GB RAM minimum
- **Storage**: 1GB free space

### Recommended Requirements
- **Node.js**: 20.0.0 or higher (LTS)
- **npm**: 10.0.0 or higher
- **Memory**: 4GB RAM or more
- **Storage**: 5GB free space for development

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📦 Installation & Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/Junior23-C/RealEstate.git
cd RealEstate/realestate-app

# Verify Node.js version
node --version  # Should be 18.0.0 or higher
```

### 2. Dependency Installation

```bash
# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local
```

**Configure your environment variables:**

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="generate-strong-secret-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials (CHANGE IN PRODUCTION)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="change-this-to-a-very-strong-password"

# Optional: Notification Services
RESEND_API_KEY="your-resend-api-key"
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_CHAT_ID="your-telegram-chat-id"
WHATSAPP_ACCESS_TOKEN="your-whatsapp-token"
WHATSAPP_PHONE_NUMBER_ID="your-whatsapp-phone-id"
DISCORD_WEBHOOK_URL="your-discord-webhook-url"
```

**Generate secure secrets:**
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### 4. Database Setup

```bash
# Initialize database and run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database with sample data
npx prisma db seed
```

### 5. Development Server

```bash
# Start development server
npm run dev

# Server will start at http://localhost:3000
```

## 🔐 Admin Access

### Default Credentials
- **Email**: Use your configured `ADMIN_EMAIL`
- **Password**: Use your configured `ADMIN_PASSWORD`
- **Access URL**: `http://localhost:3000/admin`

### Security Notes
- **Change default credentials** immediately for production
- **Use strong passwords** (minimum 12 characters)
- **Enable two-factor authentication** if implementing additional security

## 📱 Usage Guide

### For Property Visitors

#### Browsing Properties
1. **Homepage**: View featured properties and latest listings
2. **Properties Page**: Access full property catalog with filtering
3. **Property Details**: Click any property for detailed information
4. **Inquiry Submission**: Use property-specific inquiry forms
5. **Contact**: General contact form for questions

#### Using Filters
- **Property Type**: House, Apartment, Condo, Townhouse, Land, Commercial
- **Status**: For Rent, For Sale, Sold, Rented
- **Price Range**: Custom min/max price filtering
- **Bedrooms/Bathrooms**: Quantity-based filtering
- **Location**: City and state filtering

### For Administrators

#### Property Management
1. **Dashboard Access**: Navigate to `/admin` and log in
2. **Add Properties**: 
   - Complete property information form
   - Upload multiple high-quality images
   - Set pricing and availability status
3. **Edit Properties**: 
   - Update any property information
   - Manage image galleries
   - Change status and pricing
4. **Property Analytics**: View performance metrics

#### Inquiry Management
1. **View Inquiries**: Access all customer inquiries
2. **Update Status**: Mark inquiries as contacted, interested, closed
3. **Customer Communication**: Track interaction history
4. **Lead Conversion**: Monitor inquiry-to-sale conversion

#### Rental Management
1. **Tenant Management**:
   - Create tenant profiles
   - Track contact information and lease history
2. **Lease Creation**:
   - Set up rental agreements
   - Define payment schedules
   - Track lease terms and conditions
3. **Payment Tracking**:
   - Monitor rent payments
   - Handle overdue payments
   - Generate payment reports

#### Notification System
1. **Email Notifications**: Automated inquiry and payment alerts
2. **WhatsApp Integration**: Instant mobile notifications
3. **Telegram Alerts**: Real-time admin notifications
4. **Discord Integration**: Team communication alerts

## 🗄️ Database Schema

### Core Models

#### Property
- **Fields**: title, description, price, type, status, location details
- **Relationships**: One-to-many with PropertyImage, Inquiry
- **Features**: JSON-based feature storage, flexible pricing

#### PropertyImage
- **Fields**: url, alt text, primary flag
- **Relationships**: Many-to-one with Property
- **Features**: Multiple images per property, primary image selection

#### User
- **Fields**: email, password (hashed), name, role
- **Relationships**: None (admin users)
- **Features**: Role-based access control, secure authentication

#### Inquiry
- **Fields**: contact info, message, status, timestamp
- **Relationships**: Many-to-one with Property
- **Features**: Status tracking, lead management

### Rental Management Models

#### Tenant
- **Fields**: personal info, contact details, emergency contact
- **Relationships**: One-to-many with Lease
- **Features**: Complete tenant profiles, lease history

#### Lease
- **Fields**: terms, dates, rent amount, deposit
- **Relationships**: Many-to-one with Property and Tenant
- **Features**: Flexible lease terms, automated payment generation

#### Payment
- **Fields**: amount, due date, status, payment date
- **Relationships**: Many-to-one with Lease
- **Features**: Automated payment tracking, overdue monitoring

#### MaintenanceRequest
- **Fields**: description, priority, status, costs
- **Relationships**: Many-to-one with Property
- **Features**: Maintenance tracking, cost management

#### Notification
- **Fields**: type, recipient, message, status
- **Relationships**: Various (Property, Lease, Tenant)
- **Features**: Multi-channel delivery, delivery tracking

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues automatically
```

### Database Management
```bash
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database and reseed
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema changes
```

### Testing & Quality
```bash
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run type-check   # TypeScript type checking
```

### Production
```bash
npm run build        # Build optimized production bundle
npm run start        # Start production server
npm run analyze      # Analyze bundle size
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Prerequisites
1. **PostgreSQL Database**: Set up on Vercel Postgres, Neon, or Supabase
2. **GitHub Repository**: Code pushed to GitHub
3. **Vercel Account**: Free tier available

#### Deployment Steps

1. **Database Setup**:
   ```bash
   # Example with Neon.tech
   # 1. Create account at neon.tech
   # 2. Create new project
   # 3. Copy connection string
   ```

2. **Vercel Configuration**:
   - Import repository in Vercel dashboard
   - Configure environment variables:
   
   ```env
   DATABASE_URL=postgresql://username:password@host:5432/database
   NEXTAUTH_SECRET=your-production-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your-secure-production-password
   ```

3. **Deploy**:
   - Vercel automatically detects Next.js
   - Builds and deploys on every push to main branch
   - Runs database migrations automatically

#### Post-Deployment
1. **Verify deployment** at your Vercel URL
2. **Test admin login** with production credentials
3. **Configure notification services** if needed
4. **Set up custom domain** (optional)

### Manual Deployment

#### Server Requirements
- **Node.js 18+** installed
- **PostgreSQL database** accessible
- **Reverse proxy** (nginx recommended)
- **SSL certificate** for HTTPS

#### Deployment Commands
```bash
# 1. Clone and setup
git clone https://github.com/Junior23-C/RealEstate.git
cd RealEstate/realestate-app
npm install

# 2. Configure environment
cp .env.example .env.production
# Edit .env.production with production values

# 3. Setup database
npx prisma migrate deploy
npx prisma db seed

# 4. Build and start
npm run build
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🎨 Customization

### Styling Customization

#### Global Styles
```css
/* src/app/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* Customize color variables */
}
```

#### Tailwind Configuration
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add custom colors
        brand: '#your-brand-color'
      }
    }
  }
}
```

### Content Customization

#### Property Types
```typescript
// Update in Prisma schema
enum PropertyType {
  HOUSE
  APARTMENT
  CONDO
  TOWNHOUSE
  LAND
  COMMERCIAL
  // Add custom types
}
```

#### Homepage Content
```typescript
// src/app/page.tsx
const heroContent = {
  title: "Your Custom Title",
  subtitle: "Your custom subtitle",
  // Customize homepage content
}
```

### Feature Configuration

#### Notification Services
```typescript
// Enable/disable notification channels
const notificationConfig = {
  email: true,
  whatsapp: true,
  telegram: false,
  discord: false
}
```

## 🔒 Security Considerations

### Authentication Security
- **Strong passwords**: Enforce password complexity
- **Session management**: Secure JWT implementation
- **Role-based access**: Admin-only sensitive operations

### Data Protection
- **Input validation**: All user inputs validated and sanitized
- **SQL injection protection**: Prisma ORM provides parameterized queries
- **XSS prevention**: React's built-in protection + sanitization

### Environment Security
- **Environment variables**: Sensitive data in environment files
- **Secret rotation**: Regular secret key updates
- **HTTPS enforcement**: SSL/TLS in production

### API Security
- **Rate limiting**: Implement for production
- **CORS configuration**: Proper cross-origin request handling
- **Error handling**: No sensitive information in error messages

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Clear Prisma cache
npx prisma generate
rm -rf node_modules/.prisma

# Reset database
npx prisma migrate reset
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Environment Issues
```bash
# Verify environment variables
npm run env:check
```

### Performance Optimization

#### Image Optimization
- Use Next.js Image component
- Implement proper image sizing
- Enable lazy loading

#### Database Optimization
- Add proper indexes
- Optimize query patterns
- Implement caching strategies

#### Bundle Optimization
```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npm run deps:check
```

## 📊 Monitoring & Analytics

### Built-in Analytics
- **Vercel Analytics**: Page views and performance
- **Speed Insights**: Core Web Vitals monitoring
- **Error Tracking**: Automatic error reporting

### Custom Metrics
- **Property views**: Track popular properties
- **Inquiry conversion**: Monitor lead quality
- **Search patterns**: Analyze user behavior

## 🤝 Contributing

### Development Setup
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Install dependencies**: `npm install`
4. **Make changes** following coding standards
5. **Test changes**: `npm run test`
6. **Submit pull request**

### Coding Standards
- **TypeScript**: Full type safety required
- **ESLint**: Follow configured rules
- **Formatting**: Prettier for consistent formatting
- **Testing**: Unit tests for new features

### Commit Guidelines
```bash
# Use conventional commits
git commit -m "feat: add property search functionality"
git commit -m "fix: resolve image upload issue"
git commit -m "docs: update API documentation"
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help
- **Documentation**: Check existing documentation first
- **Issues**: Create GitHub issue for bugs
- **Discussions**: Use GitHub discussions for questions
- **Community**: Join our community forums

### Support Channels
- **GitHub Issues**: Bug reports and feature requests
- **Email**: Technical support inquiries
- **Documentation**: Comprehensive guides and tutorials

---

**Built with modern web technologies for the real estate industry.**