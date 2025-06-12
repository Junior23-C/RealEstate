# Real Estate Application API Documentation

A comprehensive REST API for managing properties, inquiries, rentals, and tenant relationships in a modern real estate management system.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL & Headers](#base-url--headers)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Properties](#properties-api)
  - [Inquiries](#inquiries-api)
  - [Admin Settings](#admin-settings-api)
  - [Rental Management](#rental-management-api)
  - [File Upload](#file-upload-api)
  - [Webhooks](#webhook-api)
  - [Health Check](#health-check-api)

## 🌟 Overview

This Next.js API provides a complete backend solution for real estate businesses with:

- **Property Management**: CRUD operations for property listings
- **Inquiry System**: Customer lead management and notifications
- **Rental Management**: Complete rental lifecycle including leases, tenants, and payments
- **Multi-channel Notifications**: Email, WhatsApp, Telegram, and Discord integration
- **File Upload**: Secure property image management
- **Admin Dashboard**: Comprehensive administrative controls

## 🔐 Authentication

### Method
- **Framework**: NextAuth.js with JWT strategy
- **Session-based**: Uses secure HTTP-only cookies
- **Role-based Access**: Admin role required for most operations

### Authentication Check
```typescript
const session = await getServerSession(authOptions)
if (!session || session.user.role !== "ADMIN") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

### Public Endpoints
- `GET /api/properties` - Property listings
- `POST /api/inquiries` - Submit inquiries
- `GET /api/contact-info` - Contact information
- `GET /api/health` - Health check (development only)

## 🌐 Base URL & Headers

### Base URL
```
/api
```

### Standard Headers
```http
Content-Type: application/json
Accept: application/json
```

### File Upload Headers
```http
Content-Type: multipart/form-data
```

## ⚠️ Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message description",
  "details": "Additional error context (optional)"
}
```

### HTTP Status Codes
- **200**: Success
- **400**: Bad Request - Invalid data or business logic violation
- **401**: Unauthorized - Authentication required or failed
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error - Database or server error

### Common Error Scenarios
- **Authentication Failure**: Missing session or invalid role
- **Validation Errors**: Invalid input data format
- **Business Logic Violations**: Operations that violate business rules
- **Database Errors**: Connection issues or constraint violations

---

## 📚 API Endpoints

## Authentication Endpoints

### NextAuth.js Handler
```http
GET/POST /api/auth/[...nextauth]
```

**Purpose**: Handles all authentication flows including login, logout, and session management

**Features**:
- Secure JWT-based sessions
- Password hashing with bcrypt
- Role-based access control
- Session persistence across requests

**Implementation**: Managed by NextAuth.js library

---

## Properties API

### Get All Properties
```http
GET /api/properties
```

**Authentication**: Public

**Query Parameters**:
- `search` (string, optional): Search term for title, address, or city
- `type` (string, optional): Property type filter
- `status` (string, optional): Property status filter
- `bedrooms` (number, optional): Minimum bedrooms
- `bathrooms` (number, optional): Minimum bathrooms
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price

**Response**:
```json
{
  "properties": [
    {
      "id": "uuid",
      "title": "Modern Downtown Apartment",
      "description": "Luxurious 2-bedroom apartment...",
      "price": 3500,
      "type": "APARTMENT",
      "status": "FOR_RENT",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "bedrooms": 2,
      "bathrooms": 2,
      "squareFeet": 1200,
      "lotSize": null,
      "yearBuilt": 2020,
      "features": "[\"Gym\", \"Pool\", \"Parking\"]",
      "images": [
        {
          "id": "uuid",
          "url": "/uploads/properties/image1.jpg",
          "alt": "Living room",
          "isPrimary": true
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Property
```http
POST /api/properties
```

**Authentication**: Admin required

**Request Body**:
```json
{
  "title": "Modern Downtown Apartment",
  "description": "Luxurious 2-bedroom apartment with stunning city views",
  "price": "3500",
  "type": "APARTMENT",
  "status": "FOR_RENT",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "bedrooms": "2",
  "bathrooms": "2",
  "squareFeet": "1200",
  "lotSize": null,
  "yearBuilt": "2020",
  "features": "[\"Gym\", \"Pool\", \"Parking\"]",
  "imageUrls": [
    "/uploads/properties/image1.jpg",
    "/uploads/properties/image2.jpg"
  ],
  "primaryImageIndex": 0
}
```

**Response**:
```json
{
  "success": true,
  "property": {
    "id": "uuid",
    "title": "Modern Downtown Apartment",
    // ... full property object
  }
}
```

### Update Property
```http
PUT /api/properties/[id]
```

**Authentication**: Admin required

**Path Parameters**:
- `id` (string): Property UUID

**Request Body**: Same as Create Property

**Business Logic**:
- Replaces all existing images with new ones
- Converts string numeric values to numbers
- Updates all property fields

### Delete Property
```http
DELETE /api/properties/[id]
```

**Authentication**: Admin required

**Path Parameters**:
- `id` (string): Property UUID

**Response**:
```json
{
  "success": true
}
```

### Admin Properties (Paginated)
```http
GET /api/admin/properties
```

**Authentication**: Admin required

**Query Parameters**:
- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 50): Items per page
- `search` (string, optional): Search term

**Features**:
- Server-side caching with `Cache-Control` headers
- Efficient pagination with total count
- Full-text search across multiple fields

**Response**:
```json
{
  "properties": [...],
  "totalCount": 25,
  "currentPage": 1,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

## Inquiries API

### Get All Inquiries
```http
GET /api/inquiries
```

**Authentication**: Admin required

**Response**:
```json
{
  "inquiries": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "message": "I'm interested in this property...",
      "propertyId": "uuid",
      "status": "NEW",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "property": {
        "id": "uuid",
        "title": "Modern Downtown Apartment",
        "price": 3500,
        "images": [...]
      }
    }
  ]
}
```

### Create Inquiry
```http
POST /api/inquiries
```

**Authentication**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in this property and would like to schedule a viewing.",
  "propertyId": "uuid"
}
```

**Business Logic**:
1. Creates inquiry record in database
2. Sends multi-channel notifications via `notificationService`
3. Includes property image URL (converts relative to absolute)
4. Notification failures don't fail inquiry creation

**Response**:
```json
{
  "success": true,
  "inquiry": {
    "id": "uuid",
    "name": "John Doe",
    // ... full inquiry object
  }
}
```

### Update Inquiry Status
```http
PATCH /api/inquiries/[id]
```

**Authentication**: Admin required

**Path Parameters**:
- `id` (string): Inquiry UUID

**Request Body**:
```json
{
  "status": "CONTACTED"
}
```

**Available Statuses**: `NEW`, `CONTACTED`, `INTERESTED`, `CLOSED`

### Delete Inquiry
```http
DELETE /api/inquiries/[id]
```

**Authentication**: Admin required

**Path Parameters**:
- `id` (string): Inquiry UUID

---

## Admin Settings API

### Contact Settings

#### Get Contact Settings
```http
GET /api/contact-info
```

**Authentication**: Public

**Response**:
```json
{
  "companyName": "Aliaj Real Estate",
  "email": "info@premiumestate.com",
  "phone": "(555) 123-4567",
  "address": "123 Main Street",
  "city": "City",
  "state": "State",
  "zipCode": "12345",
  "businessHours": {
    "monday": "9:00 AM - 6:00 PM",
    "tuesday": "9:00 AM - 6:00 PM",
    "wednesday": "9:00 AM - 6:00 PM",
    "thursday": "9:00 AM - 6:00 PM",
    "friday": "9:00 AM - 6:00 PM",
    "saturday": "10:00 AM - 4:00 PM",
    "sunday": "Closed"
  }
}
```

#### Update Contact Settings
```http
PUT /api/admin/settings/contact
```

**Authentication**: Admin required

**Request Body**: Same as response format above

### Password Management

#### Change Password
```http
PUT /api/admin/settings/password
```

**Authentication**: Admin required

**Request Body**:
```json
{
  "currentPassword": "current_password",
  "newPassword": "new_secure_password"
}
```

**Security Features**:
- Verifies current password with bcrypt
- Hashes new password with bcrypt (10 rounds)
- No password strength validation (implement client-side)

**Error Responses**:
- `400`: Current password incorrect
- `404`: User not found

### Profile Management

#### Update Profile
```http
PUT /api/admin/settings/profile
```

**Authentication**: Admin required

**Request Body**:
```json
{
  "name": "Admin User",
  "email": "admin@newdomain.com"
}
```

**Business Logic**:
- Checks email uniqueness before updating
- Updates both name and email fields

**Error Responses**:
- `400`: Email already in use by another user

---

## Rental Management API

### Lease Management

#### Get All Leases
```http
GET /api/rentals/leases
```

**Authentication**: Admin required

**Response**:
```json
{
  "leases": [
    {
      "id": "uuid",
      "leaseNumber": "L-2024-001",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "monthlyRent": 2500,
      "securityDeposit": 2500,
      "status": "ACTIVE",
      "notes": "Standard lease agreement",
      "property": {
        "title": "Downtown Apartment",
        "address": "123 Main St",
        "images": [...]
      },
      "tenant": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "payments": [
        {
          "amount": 2500,
          "dueDate": "2024-01-01T00:00:00.000Z",
          "status": "PAID",
          "paidDate": "2023-12-28T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

#### Create Lease
```http
POST /api/rentals/leases
```

**Authentication**: Admin required

**Request Body**:
```json
{
  "propertyId": "uuid",
  "tenantId": "uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "monthlyRent": "2500",
  "securityDeposit": "2500",
  "notes": "Standard lease agreement"
}
```

**Business Logic**:
1. Generates unique lease number (L-YYYY-XXX format)
2. Updates property status to "RENTED"
3. Auto-generates monthly payment schedule
4. Creates payment records from start to end date
5. Sets all payments to "PENDING" status

**Response**:
```json
{
  "success": true,
  "lease": {
    "id": "uuid",
    "leaseNumber": "L-2024-001",
    // ... full lease object
  },
  "paymentsCreated": 12
}
```

### Tenant Management

#### Get All Tenants
```http
GET /api/rentals/tenants
```

**Authentication**: Admin required

**Response**:
```json
{
  "tenants": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "emergencyContact": "Jane Doe",
      "emergencyPhone": "+1234567891",
      "employer": "Tech Company",
      "employerPhone": "+1234567892",
      "monthlyIncome": 5000,
      "previousAddress": "456 Old Street",
      "reasonForLeaving": "Job relocation",
      "leases": [
        {
          "property": {
            "title": "Downtown Apartment"
          },
          "payments": [...]
        }
      ]
    }
  ]
}
```

#### Create Tenant
```http
POST /api/rentals/tenants
```

**Authentication**: Admin required

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "+1234567891",
  "employer": "Tech Company",
  "employerPhone": "+1234567892",
  "monthlyIncome": "5000",
  "previousAddress": "456 Old Street",
  "reasonForLeaving": "Job relocation"
}
```

#### Get Tenant Details
```http
GET /api/rentals/tenants/[id]
```

**Authentication**: Admin required

**Path Parameters**:
- `id` (string): Tenant UUID

**Response**: Complete tenant information with lease history and payments

#### Update Tenant
```http
PUT /api/rentals/tenants/[id]
```

**Authentication**: Admin required

**Request Body**: Same as Create Tenant

#### Delete Tenant
```http
DELETE /api/rentals/tenants/[id]
```

**Authentication**: Admin required

**Business Logic**: Prevents deletion if tenant has active leases

**Error Responses**:
- `400`: Cannot delete tenant with active leases

### Payment Management

#### Get Payments
```http
GET /api/rentals/payments
```

**Authentication**: Admin required

**Query Parameters**:
- `status` (string, optional): Filter by payment status (`PENDING`, `PAID`, `LATE`, `PARTIAL`)
- `leaseId` (string, optional): Filter by specific lease

**Response**:
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 2500,
      "dueDate": "2024-01-01T00:00:00.000Z",
      "status": "PAID",
      "paidDate": "2023-12-28T00:00:00.000Z",
      "paymentMethod": "Bank Transfer",
      "transactionId": "TXN123456",
      "notes": "On time payment",
      "lease": {
        "leaseNumber": "L-2024-001",
        "property": {
          "title": "Downtown Apartment"
        },
        "tenant": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    }
  ]
}
```

#### Create Payment
```http
POST /api/rentals/payments
```

**Authentication**: Admin required

**Request Body**:
```json
{
  "leaseId": "uuid",
  "tenantId": "uuid",
  "amount": "2500",
  "type": "RENT",
  "dueDate": "2024-01-01",
  "paymentMethod": "Bank Transfer",
  "transactionId": "TXN123456",
  "lateFeePaid": "50",
  "notes": "Payment notes"
}
```

**Business Logic**:
- Auto-retrieves tenant from lease if not provided
- Incorporates late fee information into notes
- Sets default status to "PENDING"

#### Update Payment
```http
PATCH /api/rentals/payments/[id]
```

**Authentication**: Admin required

**Path Parameters**:
- `id` (string): Payment UUID

**Request Body**: Partial payment update (any fields from payment object)

**Business Logic**:
- Auto-sets `paidDate` when status changed to "PAID"
- Handles late fee information

#### Delete Payment
```http
DELETE /api/rentals/payments/[id]
```

**Authentication**: Admin required

### Notification Management

#### Get Notifications
```http
GET /api/rentals/notifications
```

**Authentication**: Admin required

**Response**: Last 50 notifications with lease, property, and tenant data

#### Process Notifications
```http
POST /api/rentals/notifications
```

**Authentication**: Admin required

**Business Logic**:
1. Identifies overdue payments and updates status to "LATE"
2. Finds payments due within 3 days
3. Creates notifications for upcoming payments
4. Creates notifications for overdue payments
5. Prevents duplicate notifications for the same day

**Notification Types**:
- `RENT_DUE`: Payment due soon (0-3 days)
- `RENT_OVERDUE`: Payment past due date

**Response**:
```json
{
  "success": true,
  "notificationsCreated": 5,
  "overduePayments": 2,
  "upcomingPayments": 8
}
```

---

## File Upload API

### Upload Property Image
```http
POST /api/upload
```

**Authentication**: Admin required

**Content-Type**: `multipart/form-data`

**Request Body**:
- `file`: Image file (JPEG, JPG, PNG, WebP)

**File Validation**:
- **Allowed Types**: JPEG, JPG, PNG, WebP
- **Maximum Size**: 5MB
- **Filename**: Sanitized and made unique with timestamp

**Upload Location**: `/public/uploads/properties/`

**Response**:
```json
{
  "url": "/uploads/properties/1640995200000-property-image.jpg",
  "filename": "1640995200000-property-image.jpg"
}
```

**Error Responses**:
- `400`: No file provided
- `400`: Invalid file type
- `400`: File too large (over 5MB)
- `500`: Upload failed

---

## Webhook API

### WhatsApp Webhook

#### Webhook Verification
```http
GET /api/webhooks/whatsapp
```

**Query Parameters**:
- `hub.mode`: "subscribe"
- `hub.verify_token`: WhatsApp verification token
- `hub.challenge`: Verification challenge

**Response**: Returns challenge string for successful verification

#### Webhook Events
```http
POST /api/webhooks/whatsapp
```

**Authentication**: WhatsApp webhook signature verification

**Purpose**: Processes incoming WhatsApp messages and events

**Response**:
```json
{
  "success": true
}
```

---

## Health Check API

### Application Health
```http
GET /api/health
```

**Authentication**:
- **Development**: Public access
- **Production**: Admin required

**Response**:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Health Checks**:
- Database connectivity test (`SELECT 1`)
- Application responsiveness
- Timestamp for monitoring

**Error Response**:
```json
{
  "status": "error",
  "database": "disconnected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Cron Job API

### Automated Payment Reminders
```http
GET /api/cron/payment-reminders
```

**Authentication**: Bearer token with `CRON_SECRET`

**Headers**:
```http
Authorization: Bearer your-cron-secret-key
```

**Purpose**: Automated processing for external cron services

**Business Logic**:
1. Updates overdue payments to "LATE" status
2. Creates notifications for payments due within 3 days
3. Creates notifications for overdue payments
4. Prevents duplicate notifications per day

**Response**:
```json
{
  "success": true,
  "notificationsCreated": 12,
  "overduePayments": 3,
  "upcomingPayments": 15,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Integration Examples**:
- **Cron-job.org**: Free external cron service
- **GitHub Actions**: Automated workflows
- **Vercel Cron**: Built-in cron jobs (paid plans)

---

## 🔒 Security Considerations

### Input Validation
- **Data Types**: Automatic type conversion and validation
- **File Upload**: Strict type and size validation
- **Business Logic**: Prevents invalid operations (e.g., deleting tenants with active leases)

### Authentication Security
- **Session Management**: Secure HTTP-only cookies
- **Password Security**: bcrypt hashing with 10 rounds
- **Role-based Access**: Admin role enforcement on sensitive operations

### Data Protection
- **SQL Injection**: Protected by Prisma ORM parameterized queries
- **File Security**: Sanitized filenames and restricted upload types
- **Error Handling**: No sensitive information in error responses

### API Security
- **Rate Limiting**: Recommended for production implementation
- **CORS**: Configure for production domains
- **Environment Variables**: All sensitive data in environment configuration

### Notification Security
- **Non-blocking**: Notification failures don't affect primary operations
- **URL Conversion**: Automatic relative-to-absolute URL conversion
- **Duplicate Prevention**: Date-based notification deduplication

---

## 📊 Performance Features

### Caching
- **Property Listings**: Server-side caching with appropriate headers
- **Database Queries**: Optimized queries with proper relationships
- **Image Optimization**: Next.js Image component integration

### Pagination
- **Efficient Queries**: Limit and offset-based pagination
- **Total Counts**: Accurate page calculation
- **Search Integration**: Combined with full-text search

### File Handling
- **Upload Optimization**: Immediate validation and secure storage
- **Image Management**: Multiple images per property with primary selection
- **Storage Structure**: Organized file structure in `/public/uploads/`

---

This API provides a complete foundation for modern real estate management applications with robust security, comprehensive functionality, and scalable architecture patterns.