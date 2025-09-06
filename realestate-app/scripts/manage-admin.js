#!/usr/bin/env node

/**
 * Admin Management Script
 * 
 * Usage:
 * npm run manage-admin create admin@example.com password123 "Admin Name"
 * npm run manage-admin reset
 * npm run manage-admin list
 * 
 * For production (with deployed app):
 * node scripts/manage-admin.js create admin@example.com password123 "Admin Name" https://your-app.vercel.app
 */

const https = require('https')
const http = require('http')

async function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const client = isHttps ? https : http
    
    const postData = JSON.stringify(data)
    const urlObj = new URL(url)
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = client.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) })
        } catch (e) {
          resolve({ status: res.statusCode, data: { error: data } })
        }
      })
    })

    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

async function manageAdmin() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  // Super admin credentials from environment
  const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL
  const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD
  
  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
    console.error('❌ Error: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD environment variables must be set')
    console.log('\nSet them in your .env file:')
    console.log('SUPER_ADMIN_EMAIL=your-super-admin@email.com')
    console.log('SUPER_ADMIN_PASSWORD=your-super-secure-password')
    process.exit(1)
  }
  
  // Determine the base URL
  const baseUrl = args[args.length - 1]?.startsWith('http') 
    ? args[args.length - 1] 
    : 'http://localhost:3000'
  
  const apiUrl = `${baseUrl}/api/admin/super-admin`
  
  try {
    switch (command) {
      case 'create': {
        const adminEmail = args[1]
        const adminPassword = args[2]
        const adminName = args[3] || 'Admin User'
        
        if (!adminEmail || !adminPassword) {
          console.error('❌ Usage: manage-admin create <email> <password> [name] [url]')
          process.exit(1)
        }

        console.log(`🔐 Creating admin user: ${adminEmail}`)
        
        const response = await makeRequest(apiUrl, {
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD,
          action: 'create_admin',
          adminEmail,
          adminPassword,
          adminName
        })

        if (response.status === 200) {
          console.log('✅ Admin user created successfully!')
          console.log('📧 Email:', adminEmail)
          console.log('🔑 Password:', adminPassword)
          console.log('🌐 Login URL:', `${baseUrl}/admin/login`)
        } else {
          console.error('❌ Error:', response.data)
        }
        break
      }

      case 'reset': {
        console.log('🔄 Resetting default admin...')
        
        const response = await makeRequest(apiUrl, {
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD,
          action: 'reset_default_admin'
        })

        if (response.status === 200) {
          console.log('✅ Default admin reset successfully!')
          console.log('📧 Email:', response.data.credentials.email)
          console.log('🔑 Password:', response.data.credentials.password)
          console.log('🌐 Login URL:', `${baseUrl}${response.data.credentials.loginUrl}`)
          console.log('⚠️ ', response.data.warning)
        } else {
          console.error('❌ Error:', response.data)
        }
        break
      }

      case 'list': {
        console.log('📋 Listing admin users...')
        
        const response = await makeRequest(apiUrl, {
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD,
          action: 'list_admins'
        })

        if (response.status === 200) {
          console.log('✅ Admin users:')
          response.data.admins.forEach(admin => {
            console.log(`  • ${admin.email} (${admin.name}) - Created: ${new Date(admin.createdAt).toLocaleDateString()}`)
          })
        } else {
          console.error('❌ Error:', response.data)
        }
        break
      }

      default:
        console.log('🛠️  Admin Management Tool')
        console.log('')
        console.log('Commands:')
        console.log('  create <email> <password> [name] [url] - Create/update admin user')
        console.log('  reset [url]                           - Reset default admin with random password')
        console.log('  list [url]                            - List all admin users')
        console.log('')
        console.log('Examples:')
        console.log('  npm run manage-admin create admin@example.com mypassword "Admin Name"')
        console.log('  npm run manage-admin reset')
        console.log('  npm run manage-admin reset https://your-app.vercel.app')
        console.log('')
        console.log('Note: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in environment variables')
        break
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
    console.log('Make sure your app is running and accessible at:', baseUrl)
  }
}

manageAdmin()