#!/bin/bash

echo "Fixing enum imports for SQLite compatibility..."

# List of files to update
files=(
  "src/components/property-card.tsx"
  "src/app/properties/[id]/property-detail.tsx"
  "src/app/page.tsx"
  "src/app/admin/properties/property-form.tsx"
  "src/app/admin/properties/property-management.tsx"
  "src/app/admin/inquiries/inquiry-management.tsx"
  "src/app/properties/property-list.tsx"
  "src/app/properties/property-filters.tsx"
)

# Update each file
for file in "${files[@]}"; do
  echo "Updating $file..."
  
  # Replace the import statement
  sed -i 's/import { PropertyStatus, PropertyType } from "@prisma\/client"/import { PropertyStatus, PropertyType } from "@\/lib\/constants"/g' "$file" 2>/dev/null || true
  sed -i 's/import { PropertyType, PropertyStatus } from "@prisma\/client"/import { PropertyType, PropertyStatus } from "@\/lib\/constants"/g' "$file" 2>/dev/null || true
  sed -i 's/import { InquiryStatus } from "@prisma\/client"/import { InquiryStatus } from "@\/lib\/constants"/g' "$file" 2>/dev/null || true
  sed -i 's/import { UserRole } from "@prisma\/client"/import { UserRole } from "@\/lib\/constants"/g' "$file" 2>/dev/null || true
done

# Special handling for next-auth.d.ts
echo "Updating src/types/next-auth.d.ts..."
sed -i 's/import { UserRole } from "@prisma\/client"/import { UserRole } from "@\/lib\/constants"/g' "src/types/next-auth.d.ts" 2>/dev/null || true

echo "✅ Import fixes completed!"