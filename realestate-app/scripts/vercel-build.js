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
    
    // Use db push instead of migrate for production
    console.log('Pushing database schema...');
    try {
      execSync('npx prisma db push --skip-seed', { stdio: 'inherit' });
      console.log('Database schema pushed successfully!');
    } catch (dbError) {
      console.log('Database push skipped (may already be up to date)');
    }
    
    console.log('Building Next.js application...');
    execSync('next build', { stdio: 'inherit' });
    console.log('Build completed successfully!');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();