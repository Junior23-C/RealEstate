const http = require('http');

console.log('🔍 Testing API endpoints...\n');

const baseUrl = 'http://localhost:3000';
const endpoints = [
  { path: '/api/health', method: 'GET', expected: 200 },
  { path: '/api/properties', method: 'GET', expected: 200 },
  { path: '/api/contact-info', method: 'GET', expected: 200 },
  { path: '/api/inquiries', method: 'GET', expected: 200 },
  { path: '/api/auth/session', method: 'GET', expected: 200 },
];

let passed = 0;
let failed = 0;

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint.path,
      method: endpoint.method,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === endpoint.expected) {
        console.log(`✅ ${endpoint.method} ${endpoint.path} - Status: ${res.statusCode}`);
        passed++;
      } else {
        console.log(`❌ ${endpoint.method} ${endpoint.path} - Expected: ${endpoint.expected}, Got: ${res.statusCode}`);
        failed++;
      }
      resolve();
    });

    req.on('error', (error) => {
      console.log(`❌ ${endpoint.method} ${endpoint.path} - Error: ${error.message}`);
      failed++;
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('Make sure your dev server is running on port 3000!\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Check your API routes!');
    process.exit(1);
  } else {
    console.log('\n✨ All API tests passed!');
  }
}

// Wait a bit for server to be ready
setTimeout(runTests, 2000);