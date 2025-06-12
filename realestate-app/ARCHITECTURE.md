# Real Estate Application Architecture Overview

This document provides a comprehensive overview of the application architecture, design patterns, project structure, and technical decisions for the real estate management system.

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Performance Considerations](#performance-considerations)
- [Deployment Architecture](#deployment-architecture)
- [Development Workflow](#development-workflow)

## 🏗️ System Architecture

### Overall Architecture Pattern
The application follows a **Modern Full-Stack Architecture** with:
- **Frontend**: Next.js with App Router (client-side and server-side rendering)
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Prisma ORM with PostgreSQL/SQLite
- **Authentication**: NextAuth.js with JWT sessions
- **File Storage**: Local file system with cloud-ready design

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Layer  │    │  Server Layer   │    │   Data Layer    │
│                 │    │                 │    │                 │
│ React Components│◄──►│ Next.js API     │◄──►│ Prisma ORM      │
│ Tailwind CSS    │    │ Routes          │    │ PostgreSQL/     │
│ Framer Motion   │    │ Middleware      │    │ SQLite          │
│ Form Validation │    │ Authentication  │    │ File Storage    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │ External APIs   │              │
         └──────────────┤ WhatsApp        │──────────────┘
                        │ Telegram        │
                        │ Discord         │
                        │ Email (Resend)  │
                        └─────────────────┘
```

### Component Architecture
- **Presentation Layer**: React components with TypeScript
- **Business Logic Layer**: API routes with validation and processing
- **Data Access Layer**: Prisma ORM with type-safe database operations
- **Integration Layer**: External service integrations (notifications)

---

## 🛠️ Technology Stack

### Frontend Technologies

#### Core Framework
- **Next.js 15.3.3**: React framework with App Router
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - Client-side routing
  - Automatic code splitting
  - Built-in optimization

#### UI and Styling
- **React 19.0.0**: Component library with latest features
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Radix UI**: Headless UI primitives for accessibility
- **shadcn/ui**: Pre-built component library
- **Framer Motion 11.15.0**: Animation and gesture library
- **Lucide React**: Modern icon library

#### State Management
- **React Hooks**: Built-in state management
- **Server State**: API-driven data fetching
- **Form State**: Controlled components with validation
- **URL State**: Search parameters for filters

### Backend Technologies

#### API Layer
- **Next.js API Routes**: Serverless API endpoints
- **NextAuth.js 4.24.8**: Authentication and session management
- **Middleware**: Request/response processing
- **Validation**: Input validation and sanitization

#### Database and ORM
- **Prisma ORM 6.1.0**: Type-safe database client
- **PostgreSQL**: Production database (scalable, ACID compliance)
- **SQLite**: Development database (local, file-based)
- **Migrations**: Version-controlled schema management

#### External Integrations
- **Resend**: Email service integration
- **WhatsApp Business API**: Instant messaging
- **Telegram Bot API**: Notifications and alerts
- **Discord Webhooks**: Team communication

### Development Tools

#### Code Quality
- **ESLint**: Code linting and best practices
- **TypeScript Compiler**: Type checking
- **Prettier**: Code formatting (via ESLint)
- **Husky**: Git hooks for quality gates

#### Build and Deployment
- **Vercel**: Deployment platform with automatic builds
- **Vercel Analytics**: Performance monitoring
- **Docker**: Containerization support
- **GitHub Actions**: CI/CD automation

---

## 📁 Project Structure

### Directory Organization
```
realestate-app/
├── 📁 src/                          # Source code
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 (routes)/             # Route groups
│   │   ├── 📁 api/                  # API endpoints
│   │   ├── 📁 admin/                # Admin dashboard
│   │   ├── 📁 properties/           # Property pages
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   └── globals.css              # Global styles
│   ├── 📁 components/               # Reusable components
│   │   ├── 📁 ui/                   # UI primitives
│   │   ├── 📁 admin/                # Admin components
│   │   └── [component-files]        # Feature components
│   ├── 📁 lib/                      # Utility libraries
│   │   ├── auth.ts                  # Authentication config
│   │   ├── db.ts                    # Database client
│   │   ├── utils.ts                 # Helper functions
│   │   └── 📁 notifications/        # Notification services
│   ├── 📁 hooks/                    # Custom React hooks
│   ├── 📁 types/                    # TypeScript definitions
│   └── middleware.ts                # Next.js middleware
├── 📁 prisma/                       # Database schema
│   ├── schema.prisma                # Main schema
│   ├── migrations/                  # Database migrations
│   └── seed.ts                      # Database seeding
├── 📁 public/                       # Static assets
│   └── 📁 uploads/                  # File uploads
├── 📁 docs/                         # Documentation
└── [config-files]                   # Configuration files
```

### File Naming Conventions
- **Components**: PascalCase (`PropertyCard.tsx`)
- **Pages**: kebab-case (`property-detail.tsx`)
- **Utilities**: camelCase (`formatPrice.ts`)
- **Types**: PascalCase (`PropertyType.ts`)
- **Hooks**: camelCase with `use` prefix (`useDebounce.ts`)

### Import Organization
```typescript
// External libraries
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Internal components
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property-card'

// Types
import type { Property } from '@prisma/client'

// Utilities
import { formatPrice } from '@/lib/utils'
```

---

## 🎯 Design Patterns

### Frontend Patterns

#### Component Composition
```typescript
// Compound component pattern
<Card>
  <CardHeader>
    <CardTitle>Property Details</CardTitle>
  </CardHeader>
  <CardContent>
    <PropertyInfo property={property} />
  </CardContent>
</Card>
```

#### Custom Hooks Pattern
```typescript
// Encapsulate logic in custom hooks
function usePropertyFilters() {
  const [filters, setFilters] = useState(defaultFilters)
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])
  
  return { filters, updateFilter }
}
```

#### Render Props Pattern
```typescript
// Flexible component composition
<PropertyList>
  {({ properties, loading }) => (
    <div>
      {loading ? <LoadingSkeleton /> : <PropertyGrid properties={properties} />}
    </div>
  )}
</PropertyList>
```

### Backend Patterns

#### Repository Pattern
```typescript
// Data access abstraction
class PropertyRepository {
  async findMany(filters: PropertyFilters) {
    return prisma.property.findMany({
      where: this.buildWhereClause(filters),
      include: this.getDefaultIncludes()
    })
  }
}
```

#### Service Layer Pattern
```typescript
// Business logic encapsulation
class NotificationService {
  async sendInquiryNotifications(inquiry: InquiryData) {
    const notifications = await Promise.allSettled([
      this.sendEmail(inquiry),
      this.sendWhatsApp(inquiry),
      this.sendTelegram(inquiry)
    ])
    
    return this.processResults(notifications)
  }
}
```

#### Factory Pattern
```typescript
// Object creation abstraction
class NotificationFactory {
  static create(type: NotificationType) {
    switch (type) {
      case 'EMAIL': return new EmailNotification()
      case 'WHATSAPP': return new WhatsAppNotification()
      case 'TELEGRAM': return new TelegramNotification()
    }
  }
}
```

### Database Patterns

#### Active Record Pattern (via Prisma)
```typescript
// ORM-based data operations
const property = await prisma.property.create({
  data: propertyData,
  include: { images: true }
})
```

#### Query Builder Pattern
```typescript
// Dynamic query construction
function buildPropertyQuery(filters: PropertyFilters) {
  const where: Prisma.PropertyWhereInput = {}
  
  if (filters.type) where.type = filters.type
  if (filters.minPrice) where.price = { gte: filters.minPrice }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } }
    ]
  }
  
  return where
}
```

---

## 🔄 Data Flow

### Frontend Data Flow

#### Component Data Flow
```
User Interaction → Component State → API Call → Database → Response → UI Update
```

#### State Management Flow
```typescript
// Unidirectional data flow
const [properties, setProperties] = useState<Property[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchProperties()
    .then(setProperties)
    .finally(() => setLoading(false))
}, [filters])
```

#### Form Data Flow
```typescript
// Controlled form components
function PropertyForm({ onSubmit }: PropertyFormProps) {
  const [formData, setFormData] = useState(initialData)
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          title: e.target.value 
        }))}
      />
    </form>
  )
}
```

### Backend Data Flow

#### API Request Flow
```
Request → Middleware → Authentication → Validation → Business Logic → Database → Response
```

#### Database Operation Flow
```typescript
// Typical API route structure
export async function POST(request: Request) {
  // 1. Authentication
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()
  
  // 2. Input validation
  const data = await request.json()
  const validatedData = validatePropertyData(data)
  
  // 3. Business logic
  const property = await createProperty(validatedData)
  
  // 4. Response
  return NextResponse.json({ success: true, property })
}
```

### Integration Data Flow

#### Notification Flow
```
Database Event → Notification Service → External APIs → Delivery Status → Database Update
```

#### File Upload Flow
```
Client → Multer → Validation → File System → Database URL → Response
```

---

## 🔒 Security Architecture

### Authentication Layer

#### Session Management
```typescript
// NextAuth.js configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await verifyCredentials(credentials)
        return user ? { id: user.id, email: user.email, role: user.role } : null
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: ({ token, user }) => user ? { ...token, role: user.role } : token,
    session: ({ session, token }) => ({ ...session, user: { ...session.user, role: token.role } })
  }
}
```

#### Route Protection
```typescript
// Middleware-based protection
export function middleware(request: NextRequest) {
  const token = request.nextUrl.pathname.startsWith('/admin')
  
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
```

### Input Validation

#### Data Validation
```typescript
// Type-safe validation
const propertySchema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().positive(),
  type: z.enum(['HOUSE', 'APARTMENT', 'CONDO']),
  bedrooms: z.number().min(0).max(20)
})

function validateProperty(data: unknown) {
  return propertySchema.parse(data)
}
```

#### File Upload Security
```typescript
// Secure file handling
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 5 * 1024 * 1024 // 5MB

function validateFile(file: File) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large')
  }
}
```

### Database Security

#### Query Safety
```typescript
// Parameterized queries via Prisma
const properties = await prisma.property.findMany({
  where: {
    title: { contains: userInput } // Safe from SQL injection
  }
})
```

#### Access Control
```typescript
// Role-based database access
async function getProperties(userRole: string) {
  const includePrivate = userRole === 'ADMIN'
  
  return prisma.property.findMany({
    where: includePrivate ? {} : { status: { in: ['FOR_RENT', 'FOR_SALE'] } }
  })
}
```

---

## ⚡ Performance Considerations

### Frontend Optimization

#### Code Splitting
```typescript
// Dynamic imports for code splitting
const AdminDashboard = dynamic(() => import('./admin-dashboard'), {
  loading: () => <DashboardSkeleton />
})
```

#### Image Optimization
```typescript
// Next.js Image component
<Image
  src={property.image}
  alt={property.title}
  width={800}
  height={600}
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### Virtualization
```typescript
// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window'

function PropertyList({ properties }) {
  return (
    <List
      height={600}
      itemCount={properties.length}
      itemSize={200}
      itemData={properties}
    >
      {PropertyRow}
    </List>
  )
}
```

### Backend Optimization

#### Database Optimization
```typescript
// Efficient queries with proper includes
const properties = await prisma.property.findMany({
  include: {
    images: { where: { isPrimary: true } }, // Only primary image
    _count: { select: { inquiries: true } } // Count instead of full data
  },
  take: 20, // Pagination
  skip: (page - 1) * 20
})
```

#### Caching Strategy
```typescript
// Response caching
export async function GET() {
  const properties = await getCachedProperties()
  
  return NextResponse.json(properties, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  })
}
```

#### Memory Management
```typescript
// Efficient data processing
function processLargeDataset(data: LargeDataset) {
  // Process in chunks to avoid memory issues
  const chunkSize = 1000
  const results = []
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize)
    results.push(...processChunk(chunk))
  }
  
  return results
}
```

### Database Performance

#### Indexing Strategy
```sql
-- Strategic indexes for common queries
CREATE INDEX idx_property_status_type ON properties(status, type);
CREATE INDEX idx_payment_due_date ON payments(due_date) WHERE status = 'PENDING';
CREATE INDEX idx_inquiry_created_at ON inquiries(created_at DESC);
```

#### Query Optimization
```typescript
// Optimized relationship loading
const propertiesWithDetails = await prisma.property.findMany({
  where: filters,
  include: {
    images: { 
      where: { isPrimary: true },
      take: 1 
    },
    inquiries: {
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5
    }
  }
})
```

---

## 🚀 Deployment Architecture

### Vercel Deployment

#### Platform Features
- **Serverless Functions**: Automatic scaling for API routes
- **Edge Network**: Global CDN for static assets
- **Automatic Builds**: Git-based deployment pipeline
- **Environment Management**: Secure environment variable handling

#### Build Configuration
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret"
  }
}
```

### Database Deployment

#### PostgreSQL Providers
- **Vercel Postgres**: Integrated database solution
- **Neon**: Serverless PostgreSQL with branching
- **Supabase**: Full-stack PostgreSQL platform
- **Railway**: Simple PostgreSQL hosting

#### Migration Strategy
```typescript
// Automated migration deployment
const migrationConfig = {
  development: 'prisma migrate dev',
  staging: 'prisma migrate deploy',
  production: 'prisma migrate deploy'
}
```

### Environment Configuration

#### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Authentication
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Admin Credentials
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-admin-password"

# External Services
RESEND_API_KEY="re_api_key"
WHATSAPP_ACCESS_TOKEN="whatsapp_token"
TELEGRAM_BOT_TOKEN="telegram_token"
DISCORD_WEBHOOK_URL="discord_webhook"
```

### Monitoring and Analytics

#### Built-in Monitoring
- **Vercel Analytics**: Page view and performance metrics
- **Speed Insights**: Core Web Vitals monitoring
- **Function Logs**: API route execution logs
- **Error Tracking**: Automatic error reporting

#### Custom Monitoring
```typescript
// Performance monitoring
export async function trackApiPerformance(
  endpoint: string,
  duration: number,
  success: boolean
) {
  await analytics.track('api_call', {
    endpoint,
    duration,
    success,
    timestamp: new Date()
  })
}
```

---

## 🔧 Development Workflow

### Local Development Setup

#### Prerequisites
```bash
# Required software
node >= 18.0.0
npm >= 8.0.0
git

# Optional but recommended
docker (for database)
vscode (with extensions)
```

#### Setup Process
```bash
# 1. Clone repository
git clone <repository-url>
cd realestate-app

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Setup database
npx prisma migrate dev
npx prisma db seed

# 5. Start development
npm run dev
```

### Code Quality Workflow

#### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

#### Testing Strategy
```typescript
// Unit testing
describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument()
  })
})

// Integration testing
describe('Property API', () => {
  it('creates property with valid data', async () => {
    const response = await request(app)
      .post('/api/properties')
      .send(validPropertyData)
      .expect(201)
    
    expect(response.body.property.title).toBe(validPropertyData.title)
  })
})
```

### Deployment Workflow

#### Git Flow
```bash
# Feature development
git checkout -b feature/property-search
git commit -m "feat: add property search functionality"
git push origin feature/property-search

# Create pull request
# After review and approval
git checkout main
git merge feature/property-search
git push origin main
```

#### Automated Deployment
```yaml
# GitHub Actions workflow
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Database Workflow

#### Schema Changes
```bash
# 1. Modify schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_property_features

# 3. Update types
npx prisma generate

# 4. Test changes
npm run test

# 5. Deploy to production
npx prisma migrate deploy
```

#### Data Management
```typescript
// Database seeding
async function seedDatabase() {
  // Clear existing data in development
  if (process.env.NODE_ENV === 'development') {
    await prisma.property.deleteMany()
  }
  
  // Seed with sample data
  await prisma.property.createMany({
    data: sampleProperties
  })
}
```

---

This architecture provides a solid foundation for a scalable, maintainable, and secure real estate management application with modern development practices and deployment strategies.