const { execSync } = require('child_process');

async function migrate() {
  try {
    console.log('Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migrations completed successfully!');
    
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated successfully!');
    
    // Optional: Run seed
    try {
      console.log('Running database seed...');
      execSync('node prisma/seed.js', { stdio: 'inherit' });
      console.log('Seed completed successfully!');
    } catch (seedError) {
      console.log('Seed skipped or already completed');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();