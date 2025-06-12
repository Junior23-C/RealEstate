# Database Schema Documentation

This document provides comprehensive documentation for the real estate application database schema, including table structures, relationships, constraints, and business logic.

## 📋 Table of Contents

- [Overview](#overview)
- [Database Configuration](#database-configuration)
- [Core Models](#core-models)
- [Rental Management Models](#rental-management-models)
- [System Models](#system-models)
- [Enumerations](#enumerations)
- [Relationships](#relationships)
- [Indexes and Constraints](#indexes-and-constraints)
- [Business Logic](#business-logic)
- [Data Types](#data-types)
- [Migration Strategy](#migration-strategy)

## 🌟 Overview

The database schema is designed to support a comprehensive real estate management system with the following capabilities:

- **Property Management**: Listings with detailed information and multiple images
- **Inquiry Tracking**: Customer lead management and communication
- **Rental Management**: Complete rental lifecycle including leases, tenants, and payments
- **Maintenance Tracking**: Property maintenance requests and resolution
- **Notification System**: Multi-channel communication and reminders
- **User Management**: Role-based authentication and access control
- **Settings Management**: Configurable company information

## 🔧 Database Configuration

### Development Environment
- **Database**: SQLite
- **File Location**: `./dev.db`
- **Provider**: `sqlite`

### Production Environment  
- **Database**: PostgreSQL
- **Provider**: `postgresql`
- **Connection**: Environment variable `DATABASE_URL`

### ORM Configuration
- **ORM**: Prisma Client
- **Generator**: `prisma-client-js`
- **Schema Location**: `prisma/schema.prisma`

---

## 📊 Core Models

### Property

**Purpose**: Central model for property listings with comprehensive information

```prisma
model Property {
  id            String    @id @default(cuid())
  title         String
  description   String
  price         Float
  type          PropertyType
  status        PropertyStatus
  address       String
  city          String
  state         String
  zipCode       String
  bedrooms      Int
  bathrooms     Float
  squareFeet    Int
  lotSize       Float?
  yearBuilt     Int?
  features      String?   // JSON string for features array
  images        PropertyImage[]
  inquiries     Inquiry[]
  leases        Lease[]
  maintenanceRequests MaintenanceRequest[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Field Details**:
- **id**: Unique identifier using CUID format
- **title**: Property listing title (required)
- **description**: Detailed property description (required)
- **price**: Property price in numeric format (required)
- **type**: Property type from enum (required)
- **status**: Current status from enum (required)
- **address**: Street address (required)
- **city**: City location (required)
- **state**: State/province (required)
- **zipCode**: Postal code (required)
- **bedrooms**: Number of bedrooms (integer, required)
- **bathrooms**: Number of bathrooms (float for half-baths, required)
- **squareFeet**: Total square footage (integer, required)
- **lotSize**: Lot size in acres (optional)
- **yearBuilt**: Construction year (optional)
- **features**: JSON string array of property features (optional)

**Relationships**:
- **One-to-Many**: PropertyImage, Inquiry, Lease, MaintenanceRequest
- **Cascading Deletes**: PropertyImage, Inquiry (when property deleted)

**Business Logic**:
- Price must be positive
- Bedrooms and bathrooms must be >= 0
- Square feet must be positive
- Year built should be reasonable (1800-current year)
- Status changes trigger related updates (e.g., RENTED creates lease requirement)

### PropertyImage

**Purpose**: Multiple images per property with primary image designation

```prisma
model PropertyImage {
  id          String    @id @default(cuid())
  url         String
  alt         String?
  isPrimary   Boolean   @default(false)
  propertyId  String
  property    Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
}
```

**Field Details**:
- **id**: Unique identifier
- **url**: Image URL path (required)
- **alt**: Alternative text for accessibility (optional)
- **isPrimary**: Designates primary property image (default: false)
- **propertyId**: Foreign key to Property (required)

**Business Logic**:
- Only one primary image per property
- Images cascade delete when property deleted
- URL validation for proper image formats
- Alt text recommended for accessibility

### Inquiry

**Purpose**: Customer inquiries and lead management

```prisma
model Inquiry {
  id          String    @id @default(cuid())
  name        String
  email       String
  phone       String?
  message     String
  propertyId  String
  property    Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  status      InquiryStatus @default(PENDING)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Field Details**:
- **id**: Unique identifier
- **name**: Customer full name (required)
- **email**: Customer email address (required)
- **phone**: Customer phone number (optional)
- **message**: Inquiry message content (required)
- **propertyId**: Related property foreign key (required)
- **status**: Inquiry status from enum (default: PENDING)

**Business Logic**:
- Email format validation required
- Phone number format validation recommended
- Status progression: PENDING → CONTACTED → CLOSED
- Automatic notification triggers on creation

### User

**Purpose**: Admin user authentication and role management

```prisma
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  password    String
  name        String?
  role        UserRole  @default(USER)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Field Details**:
- **id**: Unique identifier
- **email**: Login email (unique, required)
- **password**: Hashed password (required)
- **name**: Display name (optional)
- **role**: User role from enum (default: USER)

**Security Features**:
- Email uniqueness enforced
- Password hashing with bcrypt (10 rounds)
- Role-based access control
- Session-based authentication

---

## 🏠 Rental Management Models

### Tenant

**Purpose**: Comprehensive tenant information and history

```prisma
model Tenant {
  id                String    @id @default(cuid())
  firstName         String
  lastName          String
  email             String    @unique
  phone             String
  dateOfBirth       DateTime?
  emergencyContact  String?
  emergencyContactPhone String?
  employer          String?
  employerPhone     String?
  monthlyIncome     Float?
  previousAddress   String?
  reasonForLeaving  String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  leases             Lease[]
  payments           Payment[]
  maintenanceRequests MaintenanceRequest[]
}
```

**Field Details**:
- **id**: Unique identifier
- **firstName/lastName**: Full name (required)
- **email**: Contact email (unique, required)
- **phone**: Primary phone number (required)
- **dateOfBirth**: Birth date for age verification (optional)
- **emergencyContact**: Emergency contact name (optional)
- **emergencyContactPhone**: Emergency contact phone (optional)
- **employer**: Current employer name (optional)
- **employerPhone**: Employer contact phone (optional)
- **monthlyIncome**: Monthly income for qualification (optional)
- **previousAddress**: Previous residence address (optional)
- **reasonForLeaving**: Reason for leaving previous residence (optional)

**Business Logic**:
- Email uniqueness enforced
- Cannot delete tenant with active leases
- Monthly income used for lease qualification
- Emergency contact recommended for all tenants

### Lease

**Purpose**: Rental agreements and lease management

```prisma
model Lease {
  id              String    @id @default(cuid())
  leaseNumber     String    @unique
  propertyId      String
  tenantId        String
  startDate       DateTime
  endDate         DateTime
  monthlyRent     Float
  securityDeposit Float
  status          LeaseStatus @default(PENDING)
  terms           String?   // JSON string for lease terms
  documents       String?   // JSON string for document URLs
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  property        Property  @relation(fields: [propertyId], references: [id])
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  payments        Payment[]
  notifications   Notification[]
}
```

**Field Details**:
- **id**: Unique identifier
- **leaseNumber**: Human-readable lease number (unique, auto-generated)
- **propertyId**: Associated property foreign key (required)
- **tenantId**: Associated tenant foreign key (required)
- **startDate**: Lease start date (required)
- **endDate**: Lease end date (required)
- **monthlyRent**: Monthly rent amount (required)
- **securityDeposit**: Security deposit amount (required)
- **status**: Lease status from enum (default: PENDING)
- **terms**: JSON string for custom lease terms (optional)
- **documents**: JSON string for document URLs (optional)

**Business Logic**:
- Lease number format: L-YYYY-XXX (auto-generated)
- End date must be after start date
- Monthly rent and security deposit must be positive
- Status changes trigger payment schedule updates
- Property status updated to RENTED when lease active

### Payment

**Purpose**: Rent payments and financial tracking

```prisma
model Payment {
  id                String    @id @default(cuid())
  leaseId           String
  lease             Lease     @relation(fields: [leaseId], references: [id])
  tenantId          String
  tenant            Tenant    @relation(fields: [tenantId], references: [id])
  amount            Float
  type              PaymentType
  status            PaymentStatus @default(PENDING)
  dueDate           DateTime
  paidDate          DateTime?
  paymentMethod     String?
  transactionId     String?
  notes             String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

**Field Details**:
- **id**: Unique identifier
- **leaseId**: Associated lease foreign key (required)
- **tenantId**: Associated tenant foreign key (required)
- **amount**: Payment amount (required)
- **type**: Payment type from enum (required)
- **status**: Payment status from enum (default: PENDING)
- **dueDate**: Payment due date (required)
- **paidDate**: Actual payment date (set when paid)
- **paymentMethod**: Payment method description (optional)
- **transactionId**: External transaction reference (optional)
- **notes**: Additional payment notes (optional)

**Business Logic**:
- Payment amount must be positive
- Due date used for overdue calculations
- Paid date auto-set when status changes to PAID
- Late fees calculated based on overdue days
- Automatic payment schedule generation for leases

### MaintenanceRequest

**Purpose**: Property maintenance and repair tracking

```prisma
model MaintenanceRequest {
  id              String    @id @default(cuid())
  propertyId      String
  tenantId        String
  title           String
  description     String
  priority        String    @default("MEDIUM")  // LOW, MEDIUM, HIGH, URGENT
  status          String    @default("OPEN")    // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  resolvedDate    DateTime?
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  property        Property  @relation(fields: [propertyId], references: [id])
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
}
```

**Field Details**:
- **id**: Unique identifier
- **propertyId**: Associated property foreign key (required)
- **tenantId**: Requesting tenant foreign key (required)
- **title**: Brief maintenance request title (required)
- **description**: Detailed description of issue (required)
- **priority**: Priority level (default: MEDIUM)
- **status**: Current status (default: OPEN)
- **resolvedDate**: Date when resolved (set when completed)
- **notes**: Additional notes and updates (optional)

**Priority Levels**: LOW, MEDIUM, HIGH, URGENT
**Status Flow**: OPEN → IN_PROGRESS → RESOLVED → CLOSED

---

## ⚙️ System Models

### ContactSettings

**Purpose**: Company contact information and business settings

```prisma
model ContactSettings {
  id              String    @id @default(cuid())
  companyName     String    @default("Aliaj Real Estate")
  email           String    @default("info@premiumestate.com")
  phone           String    @default("(555) 123-4567")
  address         String    @default("123 Main Street")
  city            String    @default("City")
  state           String    @default("State")
  zipCode         String    @default("12345")
  businessHours   String?   // JSON string for business hours
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Field Details**:
- **id**: Unique identifier
- **companyName**: Business name (default provided)
- **email**: Business contact email (default provided)
- **phone**: Business phone number (default provided)
- **address**: Business street address (default provided)
- **city**: Business city (default provided)
- **state**: Business state (default provided)
- **zipCode**: Business postal code (default provided)
- **businessHours**: JSON string for operating hours (optional)

**Business Hours JSON Format**:
```json
{
  "monday": "9:00 AM - 6:00 PM",
  "tuesday": "9:00 AM - 6:00 PM",
  "wednesday": "9:00 AM - 6:00 PM",
  "thursday": "9:00 AM - 6:00 PM",
  "friday": "9:00 AM - 6:00 PM",
  "saturday": "10:00 AM - 4:00 PM",
  "sunday": "Closed"
}
```

### Notification

**Purpose**: Multi-channel notification management and tracking

```prisma
model Notification {
  id                String    @id @default(cuid())
  type              NotificationType
  title             String
  message           String
  recipientEmail    String
  recipientPhone    String?
  status            NotificationStatus @default(PENDING)
  sentAt            DateTime?
  metadata          String?   // JSON string for additional data
  leaseId           String?
  lease             Lease?    @relation(fields: [leaseId], references: [id])
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

**Field Details**:
- **id**: Unique identifier
- **type**: Notification type from enum (required)
- **title**: Notification subject/title (required)
- **message**: Notification content (required)
- **recipientEmail**: Recipient email address (required)
- **recipientPhone**: Recipient phone number (optional)
- **status**: Delivery status from enum (default: PENDING)
- **sentAt**: Timestamp when notification sent (set when delivered)
- **metadata**: JSON string for additional data (optional)
- **leaseId**: Associated lease foreign key (optional)

**Supported Channels**:
- Email (Resend API)
- WhatsApp (WhatsApp Business API)
- Telegram (Bot API)
- Discord (Webhook)

---

## 📝 Enumerations

### PropertyType
```prisma
enum PropertyType {
  HOUSE
  APARTMENT
  CONDO
  TOWNHOUSE
  LAND
  COMMERCIAL
}
```

**Usage**: Categorizes properties by type for filtering and display

### PropertyStatus
```prisma
enum PropertyStatus {
  FOR_RENT
  FOR_SALE
  RENTED
  SOLD
}
```

**Usage**: Tracks property availability and transaction status

### InquiryStatus
```prisma
enum InquiryStatus {
  PENDING
  CONTACTED
  CLOSED
}
```

**Usage**: Tracks inquiry lifecycle and follow-up status

### UserRole
```prisma
enum UserRole {
  USER
  ADMIN
}
```

**Usage**: Role-based access control for administrative functions

### LeaseStatus
```prisma
enum LeaseStatus {
  ACTIVE
  EXPIRED
  TERMINATED
  PENDING
}
```

**Usage**: Tracks lease agreement status throughout lifecycle

### PaymentType
```prisma
enum PaymentType {
  RENT
  SECURITY_DEPOSIT
  LATE_FEE
  MAINTENANCE
  OTHER
}
```

**Usage**: Categorizes different types of payments for reporting

### PaymentStatus
```prisma
enum PaymentStatus {
  PENDING
  PAID
  LATE
  PARTIAL
  CANCELLED
}
```

**Usage**: Tracks payment status for financial management

### NotificationType
```prisma
enum NotificationType {
  PAYMENT_REMINDER
  RENT_DUE
  RENT_OVERDUE
  LEASE_EXPIRY
  MAINTENANCE_UPDATE
  GENERAL
}
```

**Usage**: Categorizes notifications for proper handling and routing

### NotificationStatus
```prisma
enum NotificationStatus {
  PENDING
  SENT
  FAILED
  CANCELLED
}
```

**Usage**: Tracks notification delivery status for reliability

---

## 🔗 Relationships

### One-to-Many Relationships

#### Property → PropertyImage
- **Type**: One-to-Many
- **Cascade**: Delete (images deleted when property deleted)
- **Business Rule**: One primary image per property

#### Property → Inquiry
- **Type**: One-to-Many
- **Cascade**: Delete (inquiries deleted when property deleted)
- **Business Rule**: Multiple inquiries allowed per property

#### Property → Lease
- **Type**: One-to-Many
- **Cascade**: Restrict (cannot delete property with active leases)
- **Business Rule**: Property can have multiple leases over time

#### Property → MaintenanceRequest
- **Type**: One-to-Many
- **Cascade**: Restrict (cannot delete property with open maintenance)
- **Business Rule**: Multiple maintenance requests per property

#### Tenant → Lease
- **Type**: One-to-Many
- **Cascade**: Restrict (cannot delete tenant with active leases)
- **Business Rule**: Tenant can have multiple leases

#### Tenant → Payment
- **Type**: One-to-Many
- **Cascade**: Restrict (cannot delete tenant with payment history)
- **Business Rule**: All payments linked to tenant

#### Tenant → MaintenanceRequest
- **Type**: One-to-Many
- **Cascade**: Restrict (cannot delete tenant with open requests)
- **Business Rule**: Track requesting tenant for communication

#### Lease → Payment
- **Type**: One-to-Many
- **Cascade**: Restrict (cannot delete lease with payment history)
- **Business Rule**: Payment schedule auto-generated for lease

#### Lease → Notification
- **Type**: One-to-Many
- **Cascade**: Set Null (notifications remain for history)
- **Business Rule**: Lease-related notifications tracked

### Many-to-One Relationships

All Many-to-One relationships are the inverse of the One-to-Many relationships listed above.

### Unique Constraints

- **User.email**: Unique constraint for login authentication
- **Tenant.email**: Unique constraint for tenant identification
- **Lease.leaseNumber**: Unique constraint for lease identification

---

## 📊 Indexes and Constraints

### Primary Keys
All models use CUID (Collision-resistant Unique Identifier) for primary keys:
- Provides URL-safe, sortable unique identifiers
- Better performance than UUIDs in many databases
- Generated client-side for offline capability

### Foreign Key Constraints
- **Referential Integrity**: All foreign keys enforced with constraints
- **Cascade Rules**: Defined per relationship based on business requirements
- **Performance**: Indexed automatically for query optimization

### Unique Constraints
- **User.email**: Prevents duplicate admin accounts
- **Tenant.email**: Ensures unique tenant identification
- **Lease.leaseNumber**: Human-readable unique lease identification

### Recommended Indexes
```sql
-- Performance indexes for common queries
CREATE INDEX idx_property_status ON Property(status);
CREATE INDEX idx_property_type ON Property(type);
CREATE INDEX idx_property_city ON Property(city);
CREATE INDEX idx_inquiry_status ON Inquiry(status);
CREATE INDEX idx_payment_status ON Payment(status);
CREATE INDEX idx_payment_due_date ON Payment(dueDate);
CREATE INDEX idx_lease_status ON Lease(status);
CREATE INDEX idx_notification_status ON Notification(status);

-- Composite indexes for complex queries
CREATE INDEX idx_property_status_type ON Property(status, type);
CREATE INDEX idx_payment_lease_status ON Payment(leaseId, status);
CREATE INDEX idx_notification_type_status ON Notification(type, status);
```

---

## 💼 Business Logic

### Property Management
- **Status Transitions**: FOR_RENT → RENTED, FOR_SALE → SOLD
- **Image Management**: One primary image enforced per property
- **Price Validation**: Must be positive, formatted consistently
- **Feature Storage**: JSON array for flexible feature lists

### Inquiry Management
- **Lead Tracking**: Status progression through sales pipeline
- **Notification Triggers**: Automatic notifications on inquiry creation
- **Duplicate Prevention**: Multiple inquiries allowed from same contact
- **Response Tracking**: Status updates track follow-up progress

### Rental Management
- **Lease Creation**: Auto-generates payment schedule for lease term
- **Payment Scheduling**: Monthly payments from start to end date
- **Overdue Tracking**: Automatic status updates for late payments
- **Property Status**: Updates property to RENTED when lease active

### Notification System
- **Multi-channel Delivery**: Email, WhatsApp, Telegram, Discord
- **Delivery Tracking**: Status updates for successful/failed delivery
- **Duplicate Prevention**: Date-based checks prevent spam
- **Template System**: Type-based message formatting

### Financial Tracking
- **Payment Types**: Categorized for financial reporting
- **Late Fee Calculation**: Based on days overdue
- **Security Deposits**: Tracked separately from rent payments
- **Transaction References**: External payment system integration

### Maintenance Management
- **Priority Levels**: Four-tier priority system
- **Status Workflow**: Open → In Progress → Resolved → Closed
- **Cost Tracking**: Maintenance costs tracked per request
- **Tenant Communication**: Direct link to requesting tenant

---

## 🗂️ Data Types

### String Fields
- **Text Content**: Properties like description, message, notes
- **Identifiers**: Email addresses, phone numbers, transaction IDs
- **JSON Storage**: Features, terms, business hours, metadata
- **Enums**: Stored as strings with validation

### Numeric Fields
- **Float**: Prices, payments, income (monetary values)
- **Int**: Bedrooms, square feet, year built (whole numbers)
- **Boolean**: isPrimary flags, status indicators

### Date/Time Fields
- **DateTime**: Timestamps with timezone support
- **Auto-generation**: createdAt with @default(now())
- **Auto-update**: updatedAt with @updatedAt
- **Optional Dates**: paidDate, resolvedDate, sentAt

### Optional Fields
- **Nullable**: Marked with ? in schema
- **Default Values**: Provided where appropriate
- **Business Logic**: Optional fields for incomplete data scenarios

---

## 🔄 Migration Strategy

### Development Migrations
```bash
# Create new migration
npx prisma migrate dev --name descriptive_migration_name

# Reset database (development only)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate
```

### Production Migrations
```bash
# Deploy migrations to production
npx prisma migrate deploy

# Verify migration status
npx prisma migrate status
```

### Schema Evolution
- **Additive Changes**: New fields, tables, indexes
- **Backward Compatible**: Maintain existing API compatibility
- **Data Migration**: Custom scripts for complex data transformations
- **Rollback Strategy**: Database backups before major migrations

### Environment-Specific Schemas
- **SQLite**: Development with local file database
- **PostgreSQL**: Production with cloud database providers
- **Multiple Files**: Separate schema files for different environments
- **Deployment Scripts**: Automated migration deployment

---

## 🔍 Query Patterns

### Common Query Examples

#### Property Search with Filters
```typescript
const properties = await prisma.property.findMany({
  where: {
    status: "FOR_RENT",
    type: "APARTMENT",
    bedrooms: { gte: 2 },
    price: { gte: 1000, lte: 3000 },
    city: { contains: "New York", mode: "insensitive" }
  },
  include: {
    images: { where: { isPrimary: true } }
  },
  orderBy: { createdAt: "desc" }
})
```

#### Tenant with Lease History
```typescript
const tenant = await prisma.tenant.findUnique({
  where: { id: tenantId },
  include: {
    leases: {
      include: {
        property: { include: { images: { where: { isPrimary: true } } } },
        payments: { orderBy: { dueDate: "desc" }, take: 5 }
      }
    }
  }
})
```

#### Overdue Payments Report
```typescript
const overduePayments = await prisma.payment.findMany({
  where: {
    status: "LATE",
    dueDate: { lt: new Date() }
  },
  include: {
    lease: {
      include: {
        property: true,
        tenant: true
      }
    }
  },
  orderBy: { dueDate: "asc" }
})
```

### Performance Considerations
- **Include Strategy**: Only include related data when needed
- **Pagination**: Use skip/take for large result sets
- **Filtering**: Database-level filtering over client-side filtering
- **Indexing**: Strategic indexes for common query patterns

---

This database schema provides a robust foundation for a comprehensive real estate management system with careful consideration for data integrity, performance, and business requirements.