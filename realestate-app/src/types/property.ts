export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: PropertyType
  status: PropertyStatus
  address: string
  city: string
  state: string
  zipCode: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  lotSize?: number
  yearBuilt?: number
  features?: string[]
  rentedDate?: Date
  rentEndDate?: Date
  tenantName?: string
  tenantEmail?: string
  tenantPhone?: string
  images: PropertyImage[]
  createdAt: Date
  updatedAt: Date
}

export interface PropertyImage {
  id: string
  url: string
  alt?: string
  isPrimary: boolean
}

export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL'
}

export enum PropertyStatus {
  FOR_RENT = 'FOR_RENT',
  FOR_SALE = 'FOR_SALE',
  RENTED = 'RENTED',
  SOLD = 'SOLD'
}