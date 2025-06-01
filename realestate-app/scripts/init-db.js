const { execSync } = require('child_process');

async function initDb() {
  try {
    console.log('Initializing database...');
    
    // Push schema to database
    console.log('Pushing database schema...');
    execSync('npx prisma db push --skip-seed', { stdio: 'inherit' });
    console.log('Database schema pushed successfully!');
    
    // Run seed
    try {
      console.log('Seeding database...');
      execSync('node prisma/seed.js', { stdio: 'inherit' });
      console.log('Database seeded successfully!');
    } catch (seedError) {
      console.log('Seeding failed or skipped:', seedError.message);
    }
    
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDb();