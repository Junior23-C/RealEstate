-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" DATETIME,
    "ssn" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "employer" TEXT,
    "monthlyIncome" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lease" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propertyId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "monthlyRent" REAL NOT NULL,
    "securityDeposit" REAL,
    "petDeposit" REAL,
    "lateFee" REAL DEFAULT 50,
    "rentDueDay" INTEGER NOT NULL DEFAULT 1,
    "leaseDocument" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lease_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Lease_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leaseId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "paidDate" DATETIME,
    "paymentMethod" TEXT,
    "checkNumber" TEXT,
    "lateFeePaid" REAL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leaseId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "scheduledFor" DATETIME NOT NULL,
    "sentAt" DATETIME,
    "method" TEXT NOT NULL DEFAULT 'EMAIL',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");
