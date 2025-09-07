import { z } from 'zod'

// Super admin validation schemas
export const superAdminAuthSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  action: z.enum(['create_admin', 'list_admins', 'reset_default_admin'], {
    message: 'Invalid action'
  }),
  adminEmail: z.string().email('Invalid admin email format').optional(),
  adminPassword: z.string().min(8, 'Admin password must be at least 8 characters').optional(),
  adminName: z.string().min(1, 'Admin name is required').optional()
}).refine((data) => {
  if (data.action === 'create_admin') {
    return data.adminEmail && data.adminPassword
  }
  return true
}, {
  message: 'Admin email and password are required for create_admin action',
  path: ['adminEmail']
})

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
})

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format')
})