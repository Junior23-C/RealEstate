const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    // New admin credentials
    const adminEmail = 'admin@aliajrealestate.com';
    const adminPassword = 'admin123!'; // Change this to your desired password
    const adminName = 'Admin User';

    console.log('🔐 Resetting admin password...');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@premiumestate.com' }
    });

    if (existingAdmin) {
      // Update existing admin with new email and password
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin password reset successfully!');
    } else {
      // Create new admin if doesn't exist
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN'
        }
      });
      console.log('✅ New admin user created!');
    }

    console.log('\n🎯 Admin Login Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\n🌐 Admin Panel URL: http://localhost:3000/admin/login');
    console.log('\n⚠️  IMPORTANT: Change this password after logging in!');
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();