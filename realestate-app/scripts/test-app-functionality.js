const { PrismaClient } = require('@prisma/client');

async function testAppFunctionality() {
  const prisma = new PrismaClient();

  try {
    console.log('Testing Real Estate App Functionality\n');
    console.log('=====================================\n');

    // 1. Test ContactSettings
    console.log('1. ContactSettings:');
    const contactSettings = await prisma.contactSettings.findFirst();
    if (contactSettings) {
      console.log('✅ ContactSettings exists');
      console.log(`   Company: ${contactSettings.companyName}`);
      console.log(`   Email: ${contactSettings.email}`);
    } else {
      console.log('❌ No ContactSettings found - this will cause errors in the contact page');
    }

    // 2. Test Properties
    console.log('\n2. Properties:');
    const properties = await prisma.property.findMany({
      include: { images: true }
    });
    console.log(`✅ Found ${properties.length} properties`);
    
    // Check for properties with features
    const propertiesWithFeatures = properties.filter(p => p.features);
    console.log(`   Properties with features: ${propertiesWithFeatures.length}`);
    
    // Check for properties with images
    const propertiesWithImages = properties.filter(p => p.images.length > 0);
    console.log(`   Properties with images: ${propertiesWithImages.length}`);

    // 3. Test Tenants
    console.log('\n3. Tenants:');
    const tenants = await prisma.tenant.findMany();
    console.log(`✅ Found ${tenants.length} tenants`);
    
    // Check for required fields
    if (tenants.length > 0) {
      const tenant = tenants[0];
      console.log('   Sample tenant fields:');
      console.log(`   - Name: ${tenant.firstName} ${tenant.lastName}`);
      console.log(`   - Emergency Contact Phone: ${tenant.emergencyContactPhone || 'Not set'}`);
    }

    // 4. Test Leases
    console.log('\n4. Leases:');
    const leases = await prisma.lease.findMany({
      include: {
        tenant: true,
        property: true,
        payments: true
      }
    });
    console.log(`✅ Found ${leases.length} leases`);
    
    // Check active leases
    const activeLeases = leases.filter(l => l.status === 'ACTIVE');
    console.log(`   Active leases: ${activeLeases.length}`);

    // 5. Test Payments
    console.log('\n5. Payments:');
    const payments = await prisma.payment.findMany();
    console.log(`✅ Found ${payments.length} payments`);
    
    // Check payment statuses
    const paymentsByStatus = {};
    payments.forEach(p => {
      paymentsByStatus[p.status] = (paymentsByStatus[p.status] || 0) + 1;
    });
    console.log('   Payments by status:', paymentsByStatus);

    // 6. Test Users
    console.log('\n6. Users:');
    const users = await prisma.user.findMany();
    console.log(`✅ Found ${users.length} users`);
    
    const adminUsers = users.filter(u => u.role === 'ADMIN');
    console.log(`   Admin users: ${adminUsers.length}`);

    // 7. Check for common issues
    console.log('\n7. Common Issues Check:');
    
    // Check for payments without valid lease/tenant references
    const paymentsWithIssues = await prisma.payment.findMany({
      include: {
        lease: {
          include: {
            tenant: true,
            property: true
          }
        }
      }
    });
    
    const paymentsWithMissingData = paymentsWithIssues.filter(p => 
      !p.lease || !p.lease.tenant || !p.lease.property
    );
    
    if (paymentsWithMissingData.length > 0) {
      console.log(`⚠️  Found ${paymentsWithMissingData.length} payments with missing lease/tenant/property data`);
    } else {
      console.log('✅ All payments have valid references');
    }

    // Check for properties with invalid status
    const rentedProperties = properties.filter(p => p.status === 'RENTED');
    const forRentProperties = properties.filter(p => p.status === 'FOR_RENT');
    console.log(`✅ Properties for rent: ${forRentProperties.length}`);
    console.log(`✅ Rented properties: ${rentedProperties.length}`);

    console.log('\n=====================================');
    console.log('Test completed successfully!\n');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAppFunctionality();