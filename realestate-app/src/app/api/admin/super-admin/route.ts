import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

/**
 * Super Admin Endpoint - Permanent solution for admin management
 * Uses environment variables for security
 * Only works if SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are set in environment
 */
export async function POST(request: Request) {
  try {
    // Check if super admin environment variables are set
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD
    
    if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
      return new NextResponse("Super admin not configured", { status: 503 })
    }

    const body = await request.json()
    const { email, password, action, adminEmail, adminPassword, adminName } = body
    
    // Verify super admin credentials
    if (email !== SUPER_ADMIN_EMAIL || password !== SUPER_ADMIN_PASSWORD) {
      return new NextResponse("Invalid super admin credentials", { status: 401 })
    }

    switch (action) {
      case 'create_admin': {
        
        if (!adminEmail || !adminPassword) {
          return new NextResponse("Admin email and password required", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 12)
        
        // Create or update admin
        const admin = await prisma.user.upsert({
          where: { email: adminEmail },
          update: {
            password: hashedPassword,
            name: adminName || 'Admin User',
            role: 'ADMIN'
          },
          create: {
            email: adminEmail,
            password: hashedPassword,
            name: adminName || 'Admin User',
            role: 'ADMIN'
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Admin user created/updated successfully',
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
          }
        })
      }

      case 'list_admins': {
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true, email: true, name: true, role: true, createdAt: true }
        })

        return NextResponse.json({
          success: true,
          admins
        })
      }

      case 'reset_default_admin': {
        // Create default admin with secure random password
        const defaultEmail = 'admin@aliajrealestate.com'
        const defaultPassword = 'Admin' + Math.random().toString(36).slice(-8) + '!'
        const hashedPassword = await bcrypt.hash(defaultPassword, 12)

        await prisma.user.upsert({
          where: { email: defaultEmail },
          update: {
            password: hashedPassword,
            name: 'Default Admin',
            role: 'ADMIN'
          },
          create: {
            email: defaultEmail,
            password: hashedPassword,
            name: 'Default Admin',
            role: 'ADMIN'
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Default admin reset successfully',
          credentials: {
            email: defaultEmail,
            password: defaultPassword,
            loginUrl: '/admin/login'
          },
          warning: 'Change this password immediately after login!'
        })
      }

      default:
        return new NextResponse("Invalid action", { status: 400 })
    }

  } catch (error) {
    console.error('Super admin endpoint error:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}