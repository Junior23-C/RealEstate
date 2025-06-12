# 🏠 Real Estate Website - Easy Installation Guide

Welcome! This guide will help you set up your real estate website step-by-step, even if you're not technical. Follow along carefully, and you'll have your website running in no time.

## 📋 What You'll Need

Before we start, make sure you have:
- A computer (Windows, Mac, or Linux)
- Internet connection
- About 30-45 minutes of time
- A cup of coffee ☕ (optional but recommended!)

## 🚀 Quick Setup Options

### Option 1: Recommended - Use Vercel (Easiest)
✅ **Best for beginners**  
✅ **Free to start**  
✅ **Automatic updates**  
✅ **Professional hosting**

### Option 2: Local Setup (For testing)
⚠️ **Requires some technical comfort**  
⚠️ **Only for local testing**  
✅ **Complete control**

---

## 🌐 Option 1: Deploy to Vercel (Recommended)

### Step 1: Get the Code
1. **Go to GitHub**
   - Open your web browser
   - Visit: `https://github.com/Junior23-C/RealEstate`
   - Click the green **"Code"** button
   - Click **"Download ZIP"**
   - Save the file to your computer

2. **Extract the Files**
   - Find the downloaded ZIP file (usually in Downloads folder)
   - Right-click and select "Extract All" (Windows) or double-click (Mac)
   - You'll get a folder called "RealEstate-main"

### Step 2: Create a Vercel Account
1. **Sign Up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Sign Up"**
   - Choose **"Continue with GitHub"** (easier) or use email
   - Complete the registration process

2. **Connect Your GitHub**
   - If you didn't use GitHub to sign up, you'll need to connect it
   - Go to Settings → Git Integration
   - Click **"Connect GitHub Account"**

### Step 3: Create a Database
1. **Go to Neon.tech**
   - Visit [neon.tech](https://neon.tech)
   - Click **"Sign Up"**
   - Choose the free plan
   - Create a new project called "real-estate-db"

2. **Get Your Database URL**
   - After creating the project, go to the Dashboard
   - Click on your project name
   - Look for **"Connection String"**
   - Copy the URL that starts with `postgresql://`
   - **Save this somewhere safe!** You'll need it later

### Step 4: Upload Your Project
1. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Sign in or create an account
   - Click the **"+"** button in top right
   - Select **"New repository"**
   - Name it "my-real-estate-website"
   - Make it **Public**
   - Click **"Create repository"**

2. **Upload Your Files**
   - In your new repository, click **"uploading an existing file"**
   - Drag and drop all files from the "realestate-app" folder
   - Add a commit message: "Initial website setup"
   - Click **"Commit changes"**

### Step 5: Deploy to Vercel
1. **Import Your Project**
   - Go back to [vercel.com](https://vercel.com)
   - Click **"New Project"**
   - Find your GitHub repository "my-real-estate-website"
   - Click **"Import"**

2. **Configure Environment Variables**
   - Before deploying, click **"Environment Variables"**
   - Add these variables one by one:

   **Required Variables:**
   ```
   DATABASE_URL = [paste your Neon database URL here]
   NEXTAUTH_SECRET = [click "Generate" button in Vercel]
   NEXTAUTH_URL = [Vercel will auto-fill this]
   ADMIN_EMAIL = your-admin-email@example.com
   ADMIN_PASSWORD = your-secure-password-here
   ```

   **Optional (for notifications):**
   ```
   RESEND_API_KEY = [leave empty for now]
   TELEGRAM_BOT_TOKEN = [leave empty for now]
   WHATSAPP_ACCESS_TOKEN = [leave empty for now]
   DISCORD_WEBHOOK_URL = [leave empty for now]
   ```

3. **Deploy!**
   - Click **"Deploy"**
   - Wait 2-3 minutes (grab that coffee!)
   - You'll see a success screen with your website URL

### Step 6: Set Up Your Website
1. **Visit Your Website**
   - Click on the URL Vercel provides
   - You should see your real estate website!

2. **Access Admin Panel**
   - Go to `[your-website-url]/admin`
   - Log in with the email and password you set up
   - You're now in the admin dashboard!

3. **Add Your First Property**
   - Click **"Properties"** in the admin menu
   - Click **"Add New Property"**
   - Fill in the details and upload photos
   - Click **"Save"**

**🎉 Congratulations! Your website is live!**

---

## 💻 Option 2: Local Setup (Testing Only)

⚠️ **Note:** This is for testing on your computer only. Your website won't be accessible to others.

### Step 1: Install Required Software

1. **Install Node.js**
   - Go to [nodejs.org](https://nodejs.org)
   - Download the **LTS version** (recommended)
   - Run the installer
   - Keep clicking "Next" with default settings
   - Restart your computer

2. **Verify Installation**
   - **Windows:** Press `Windows + R`, type `cmd`, press Enter
   - **Mac:** Press `Cmd + Space`, type `terminal`, press Enter
   - Type: `node --version`
   - You should see something like `v18.17.0`

### Step 2: Download and Extract
1. **Get the Code**
   - Download the ZIP file from GitHub (same as Option 1, Step 1)
   - Extract to a folder on your Desktop
   - Open the "realestate-app" folder

### Step 3: Open Terminal/Command Prompt
1. **Navigate to the Project**
   - **Windows:** Hold Shift, right-click in the folder, select "Open PowerShell window here"
   - **Mac:** Right-click in the folder, select "New Terminal at Folder"

### Step 4: Install and Setup
1. **Install Dependencies**
   ```
   npm install
   ```
   - Wait for it to finish (2-3 minutes)

2. **Set Up Environment**
   ```
   copy .env.example .env.local
   ```
   - **Mac users:** replace `copy` with `cp`

3. **Edit Environment File**
   - Open the `.env.local` file in a text editor
   - Change these values:
   ```
   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=your-password-here
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Set Up Database**
   ```
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start the Website**
   ```
   npm run dev
   ```

6. **Open Your Website**
   - Open your web browser
   - Go to: `http://localhost:3000`
   - Your website should be running!

---

## 🎯 What's Next?

### For Beginners
1. **Customize Your Website** → See [Customization Guide](CUSTOMIZATION_GUIDE.md)
2. **Add Your Properties** → Log into admin panel at `/admin`
3. **Set Up Notifications** → Configure email and messaging (optional)

### For Advanced Users
1. **Custom Domain** → Connect your own domain in Vercel
2. **Email Setup** → Configure Resend for contact forms
3. **Backup Setup** → Regular database backups

## ❓ Need Help?

### Common Questions

**Q: My website shows an error page**
A: Check the [Troubleshooting Guide](TROUBLESHOOTING_GUIDE.md)

**Q: I forgot my admin password**
A: You can reset it in your environment variables

**Q: How do I add more properties?**
A: Log into `/admin` and use the Properties section

**Q: Can I change the colors and text?**
A: Yes! See the [Customization Guide](CUSTOMIZATION_GUIDE.md)

### Getting Support
- Check the [Troubleshooting Guide](TROUBLESHOOTING_GUIDE.md) first
- Review the [Features Guide](FEATURES_GUIDE.md) to understand what's possible
- Create an issue on GitHub if you're stuck

## 📱 Mobile-Friendly

Your website automatically works on:
- 📱 Phones (iOS and Android)
- 💻 Tablets (iPad, etc.)
- 🖥️ Desktop computers
- 💻 Laptops

## 🔒 Security Features

Your website includes:
- ✅ Secure admin login
- ✅ Protected admin area
- ✅ Secure file uploads
- ✅ Database protection
- ✅ Spam prevention

---

**🎉 You Did It!**

You now have a professional real estate website running! Take some time to explore the admin panel and add your first few properties. 

**Next Steps:**
1. Read the [Customization Guide](CUSTOMIZATION_GUIDE.md) to make it yours
2. Check out all the [Features](FEATURES_GUIDE.md) available
3. If you run into issues, consult the [Troubleshooting Guide](TROUBLESHOOTING_GUIDE.md)

Welcome to your new real estate website! 🏠✨