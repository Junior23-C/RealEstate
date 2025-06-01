const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if data already exists
    const existingProperties = await prisma.property.count()
    if (existingProperties > 0) {
      console.log('Database already seeded, skipping...')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@premiumestate.com' },
      update: {},
      create: {
        email: 'admin@premiumestate.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    })

    console.log('Created admin user:', admin.email)

    // Create sample properties
    const properties = [
      {
        title: 'Modern Downtown Apartment',
        description: 'Luxurious 2-bedroom apartment in the heart of downtown with stunning city views.',
        price: 3500,
        type: 'APARTMENT',
        status: 'FOR_RENT',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        yearBuilt: 2020,
        features: JSON.stringify(['Gym', 'Pool', 'Concierge', 'Parking']),
      },
      {
        title: 'Spacious Family Home',
        description: 'Beautiful 4-bedroom house perfect for families, featuring a large backyard and modern amenities.',
        price: 750000,
        type: 'HOUSE',
        status: 'FOR_SALE',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2800,
        lotSize: 0.25,
        yearBuilt: 2018,
        features: JSON.stringify(['Garden', 'Garage', 'Solar Panels', 'Smart Home']),
      },
      {
        title: 'Luxury Waterfront Condo',
        description: 'Exclusive 3-bedroom condo with breathtaking ocean views and premium finishes throughout.',
        price: 1200000,
        type: 'CONDO',
        status: 'FOR_SALE',
        address: '789 Beach Road',
        city: 'Miami',
        state: 'FL',
        zipCode: '33139',
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 2200,
        yearBuilt: 2022,
        features: JSON.stringify(['Beach Access', 'Balcony', 'Wine Cellar', 'Fitness Center']),
      },
      {
        title: 'Cozy Studio Apartment',
        description: 'Efficient studio apartment ideal for young professionals, located near public transport.',
        price: 1800,
        type: 'APARTMENT',
        status: 'FOR_RENT',
        address: '321 University Way',
        city: 'Boston',
        state: 'MA',
        zipCode: '02115',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 600,
        yearBuilt: 2019,
        features: JSON.stringify(['Laundry', 'High-Speed Internet', 'Pet Friendly']),
      },
      {
        title: 'Modern Townhouse',
        description: 'Contemporary 3-bedroom townhouse with rooftop terrace and garage parking.',
        price: 4200,
        type: 'TOWNHOUSE',
        status: 'FOR_RENT',
        address: '567 Park Lane',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1800,
        yearBuilt: 2021,
        features: JSON.stringify(['Rooftop Terrace', 'Garage', 'Hardwood Floors', 'Central AC']),
      }
    ]

    const propertyImages = [
      ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
      ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'],
      ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      ['https://images.unsplash.com/photo-1580216643062-cf460548a66a?w=800', 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=800']
    ]

    for (let i = 0; i < properties.length; i++) {
      const property = await prisma.property.create({
        data: {
          ...properties[i],
          images: {
            create: propertyImages[i].map((url, index) => ({
              url,
              alt: `${properties[i].title} - Image ${index + 1}`,
              isPrimary: index === 0
            }))
          }
        }
      })
      console.log(`Created property: ${property.title}`)
    }

    console.log('Seed data created successfully!')
  } catch (error) {
    console.error('Seed error:', error)
    // Don't throw error to prevent build failure
    console.log('Continuing with build...')
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    // Don't exit with error to prevent build failure
    console.log('Continuing with build despite seed error...')
  })
  .finally(async () => {
    await prisma.$disconnect()
  })