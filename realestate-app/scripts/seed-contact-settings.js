const { PrismaClient } = require('@prisma/client');

async function seedContactSettings() {
  const prisma = new PrismaClient();

  try {
    // Check if ContactSettings already exists
    const existing = await prisma.contactSettings.findFirst();
    
    if (existing) {
      console.log('ContactSettings already exists:', existing);
      return;
    }

    // Create default ContactSettings
    const contactSettings = await prisma.contactSettings.create({
      data: {
        companyName: "Aliaj Real Estate",
        email: "info@aliajrealestate.com",
        phone: "(555) 123-4567",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        businessHours: JSON.stringify({
          monday: "9:00 AM - 6:00 PM",
          tuesday: "9:00 AM - 6:00 PM",
          wednesday: "9:00 AM - 6:00 PM",
          thursday: "9:00 AM - 6:00 PM",
          friday: "9:00 AM - 6:00 PM",
          saturday: "10:00 AM - 4:00 PM",
          sunday: "Closed"
        })
      }
    });

    console.log('ContactSettings created successfully:', contactSettings);
  } catch (error) {
    console.error('Error seeding ContactSettings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedContactSettings();