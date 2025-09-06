import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// TEMPORARY endpoint for admin password reset
// DELETE THIS FILE AFTER USE for security!
export async function POST(request: Request) {
  try {
    const { secretKey } = await request.json()
    
    // Simple security check - you'll call this with a secret
    if (secretKey !== "TEMP_RESET_KEY_2024") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    console.log('🔐 Resetting production admin password...')
    
    // New admin credentials for production
    const adminEmail = 'admin@aliajrealestate.com'
    const adminPassword = 'NewAdmin2024!' // Strong password
    const adminName = 'Admin User'

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    // Find existing admin or create new one
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      // Update existing admin
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN'
        }
      })
      console.log('✅ Admin password updated successfully!')
    } else {
      // Create new admin
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN'
        }
      })
      console.log('✅ New admin user created!')
    }

    return NextResponse.json({
      success: true,
      message: 'Admin password reset successfully',
      credentials: {
        email: adminEmail,
        password: adminPassword,
        adminUrl: '/admin/login'
      },
      warning: 'IMPORTANT: Delete this API endpoint immediately after use!'
    })

  } catch (error) {
    console.error('❌ Error resetting admin password:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}