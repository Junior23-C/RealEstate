const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Testing database connection...\n');

    // Test ContactSettings
    console.log('1. Testing ContactSettings table:');
    try {
      const contactSettings = await prisma.contactSettings.findFirst();
      console.log('✅ ContactSettings table exists');
      console.log('   Records found:', contactSettings ? 1 : 0);
    } catch (error) {
      console.log('❌ ContactSettings error:', error.message);
    }

    // Test Property
    console.log('\n2. Testing Property table:');
    try {
      const propertyCount = await prisma.property.count();
      console.log('✅ Property table exists');
      console.log('   Records found:', propertyCount);
    } catch (error) {
      console.log('❌ Property error:', error.message);
    }

    // Test Tenant
    console.log('\n3. Testing Tenant table:');
    try {
      const tenantCount = await prisma.tenant.count();
      console.log('✅ Tenant table exists');
      console.log('   Records found:', tenantCount);
    } catch (error) {
      console.log('❌ Tenant error:', error.message);
    }

    // Test User
    console.log('\n4. Testing User table:');
    try {
      const userCount = await prisma.user.count();
      console.log('✅ User table exists');
      console.log('   Records found:', userCount);
    } catch (error) {
      console.log('❌ User error:', error.message);
    }

    // Test Lease
    console.log('\n5. Testing Lease table:');
    try {
      const leaseCount = await prisma.lease.count();
      console.log('✅ Lease table exists');
      console.log('   Records found:', leaseCount);
    } catch (error) {
      console.log('❌ Lease error:', error.message);
    }

    // Test Payment
    console.log('\n6. Testing Payment table:');
    try {
      const paymentCount = await prisma.payment.count();
      console.log('✅ Payment table exists');
      console.log('   Records found:', paymentCount);
    } catch (error) {
      console.log('❌ Payment error:', error.message);
    }

    // Test Notification
    console.log('\n7. Testing Notification table:');
    try {
      const notificationCount = await prisma.notification.count();
      console.log('✅ Notification table exists');
      console.log('   Records found:', notificationCount);
    } catch (error) {
      console.log('❌ Notification error:', error.message);
    }

    // List all model names from Prisma
    console.log('\n\nAvailable Prisma models:');
    const models = Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$'));
    models.forEach(model => {
      console.log(`  - ${model}`);
    });

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();