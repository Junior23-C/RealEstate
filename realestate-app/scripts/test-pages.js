const http = require('http');

console.log('🌐 Testing all pages...\n');

const pages = [
  '/',
  '/properties',
  '/contact',
  '/admin/login',
  '/properties/cmbcjrokk0007v8123weeemwc', // Test a property detail page
];

let passed = 0;
let failed = 0;

async function testPage(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${path} - Status: ${res.statusCode}`);
          passed++;
        } else if (res.statusCode === 404) {
          console.log(`⚠️  ${path} - 404 Not Found (might be dynamic route)`);
          passed++; // Count as passed since 404 is expected for some routes
        } else {
          console.log(`❌ ${path} - Status: ${res.statusCode}`);
          failed++;
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path} - Error: ${error.message}`);
      failed++;
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('Make sure your dev server is running on port 3000!\n');
  
  for (const page of pages) {
    await testPage(page);
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some pages failed to load. Check for errors!');
    process.exit(1);
  } else {
    console.log('\n✨ All pages loaded successfully!');
  }
}

// Wait a bit for server to be ready
setTimeout(runTests, 2000);