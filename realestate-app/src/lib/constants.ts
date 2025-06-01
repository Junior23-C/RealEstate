// Property type constants
export const PropertyType = {
  HOUSE: 'HOUSE',
  APARTMENT: 'APARTMENT',
  CONDO: 'CONDO',
  TOWNHOUSE: 'TOWNHOUSE',
  LAND: 'LAND',
  COMMERCIAL: 'COMMERCIAL'
} as const

export type PropertyType = typeof PropertyType[keyof typeof PropertyType]

// Property status constants
export const PropertyStatus = {
  FOR_RENT: 'FOR_RENT',
  FOR_SALE: 'FOR_SALE',
  RENTED: 'RENTED',
  SOLD: 'SOLD'
} as const

export type PropertyStatus = typeof PropertyStatus[keyof typeof PropertyStatus]

// Inquiry status constants
export const InquiryStatus = {
  PENDING: 'PENDING',
  CONTACTED: 'CONTACTED',
  CLOSED: 'CLOSED'
} as const

export type InquiryStatus = typeof InquiryStatus[keyof typeof InquiryStatus]

// User role constants
export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]