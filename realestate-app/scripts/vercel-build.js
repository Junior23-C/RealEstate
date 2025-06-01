const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function build() {
  try {
    // Copy production schema to main schema file
    const prodSchemaPath = path.join(__dirname, '../prisma/schema.prod.prisma');
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    
    console.log('Copying production schema...');
    fs.copyFileSync(prodSchemaPath, schemaPath);
    console.log('Production schema copied successfully!');
    
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated successfully!');
    
    // Skip database operations during build
    // These should be done after deployment
    console.log('Skipping database operations during build...');
    
    console.log('Building Next.js application...');
    try {
      execSync('next build', { stdio: 'inherit' });
      console.log('Build completed successfully!');
    } catch (buildError) {
      console.error('Next.js build failed:', buildError.message);
      throw buildError;
    }
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();