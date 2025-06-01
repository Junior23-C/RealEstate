-- CreateTable
CREATE TABLE "ContactSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL DEFAULT 'Aliaj Real Estate',
    "email" TEXT NOT NULL DEFAULT 'info@premiumestate.com',
    "phone" TEXT NOT NULL DEFAULT '(555) 123-4567',
    "address" TEXT NOT NULL DEFAULT '123 Main Street',
    "city" TEXT NOT NULL DEFAULT 'City',
    "state" TEXT NOT NULL DEFAULT 'State',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "businessHours" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
