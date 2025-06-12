# 🔧 Troubleshooting Guide - Fix Common Issues

Don't panic! Every website has occasional hiccups. This guide will help you solve the most common problems quickly and easily.

## 🚨 Quick Emergency Fixes

### Website Won't Load At All
1. **Check your internet connection**
2. **Try a different browser** (Chrome, Firefox, Safari)
3. **Clear your browser cache** (Ctrl+F5 or Cmd+Shift+R)
4. **Wait 5 minutes and try again** (might be temporary)

### Can't Access Admin Panel
1. **Check your login URL**: Should be `your-website.com/admin`
2. **Verify your email and password**
3. **Try resetting your password** (see Admin Password Reset below)

---

## 🔐 Admin Panel Issues

### Problem: Can't Log Into Admin Panel

**Symptoms:**
- "Invalid credentials" error
- Login page keeps reloading
- Blank page after login

**Solutions:**

1. **Double-Check Your Credentials**
   ```
   ✅ Email: exactly as you set it up (case-sensitive)
   ✅ Password: exactly as you typed it (check Caps Lock)
   ✅ No extra spaces before or after
   ```

2. **Reset Your Password**
   - Go to your Vercel dashboard
   - Find your project → Settings → Environment Variables
   - Find `ADMIN_PASSWORD`
   - Click "Edit" and enter a new password
   - Redeploy your site
   - Try logging in with the new password

3. **Check Environment Variables**
   ```
   Required variables:
   ✅ ADMIN_EMAIL (your email)
   ✅ ADMIN_PASSWORD (your password)
   ✅ NEXTAUTH_SECRET (should be auto-generated)
   ✅ NEXTAUTH_URL (your website URL)
   ```

### Problem: Admin Panel Loads But Features Don't Work

**Solutions:**

1. **Check Database Connection**
   - Go to your Neon.tech dashboard
   - Verify your database is active
   - Check if your connection string is correct in Vercel

2. **Refresh the Page**
   - Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - This clears cache and reloads everything

3. **Check Browser Console**
   - Press F12 to open developer tools
   - Look for red error messages
   - Take a screenshot if you see errors

---

## 🏠 Property Management Issues

### Problem: Can't Add New Properties

**Symptoms:**
- Form doesn't submit
- Error message appears
- Page refreshes but property not saved

**Solutions:**

1. **Check Required Fields**
   ```
   Required information:
   ✅ Property title
   ✅ Description  
   ✅ Price (numbers only)
   ✅ Property type
   ✅ Address, city, state
   ✅ Bedrooms and bathrooms
   ✅ Square footage
   ```

2. **Image Upload Issues**
   - **File size**: Must be under 5MB
   - **File types**: Only JPG, PNG, WebP allowed
   - **File names**: Remove special characters (use only letters, numbers, dashes)

3. **Price Format**
   ```
   ✅ Correct: 250000 or 250,000
   ❌ Wrong: $250,000 or 250k
   ```

### Problem: Images Won't Upload

**Solutions:**

1. **Check Image Requirements**
   - **Size**: Maximum 5MB per image
   - **Format**: JPG, JPEG, PNG, or WebP only
   - **Dimensions**: Recommended 1200x800 pixels

2. **Rename Your Files**
   ```
   ✅ Good names: property-1.jpg, house-front.png
   ❌ Bad names: IMG_001!@#.jpg, my photo (1).png
   ```

3. **Try One Image at a Time**
   - Upload images individually
   - Wait for each upload to complete
   - Then try multiple images

### Problem: Properties Not Showing on Website

**Solutions:**

1. **Check Property Status**
   - In admin panel, edit the property
   - Make sure status is "For Rent" or "For Sale"
   - Not "Sold" or "Rented"

2. **Refresh the Website**
   - Changes may take a few minutes to appear
   - Clear browser cache and reload

3. **Check Filters**
   - On the properties page, reset all filters
   - Make sure price range includes your property

---

## 📧 Contact Form Issues

### Problem: Contact Forms Not Working

**Symptoms:**
- "Thank you" message doesn't appear
- No emails received
- Form submission fails

**Solutions:**

1. **Check Email Setup**
   - Verify your admin email in environment variables
   - Test with a different email address

2. **Check Required Fields**
   ```
   Contact form needs:
   ✅ Name (at least 2 characters)
   ✅ Valid email address
   ✅ Message (at least 10 characters)
   ```

3. **Email Delivery Issues**
   - Check spam folder
   - Add your domain to safe senders
   - Consider setting up email service (Resend)

---

## 🌐 Website Display Issues

### Problem: Website Looks Broken or Strange

**Symptoms:**
- Text overlapping
- Images not showing
- Colors look wrong
- Layout is messy

**Solutions:**

1. **Clear Browser Cache**
   - **Chrome**: Ctrl+Shift+Delete → Clear cache
   - **Firefox**: Ctrl+Shift+Delete → Clear cache
   - **Safari**: Cmd+Shift+Delete → Clear cache

2. **Try Different Browser**
   - Test in Chrome, Firefox, and Safari
   - If it works in one browser, it's a cache issue

3. **Check CSS Changes**
   - If you recently customized colors/styles
   - Revert your CSS changes one by one
   - Or restore from backup

### Problem: Mobile View Doesn't Work

**Solutions:**

1. **Test Responsive Design**
   - Resize your browser window
   - Use browser developer tools (F12)
   - Switch to mobile view

2. **Check Viewport Settings**
   - Usually handled automatically
   - Contact support if mobile view is broken

---

## 💾 Database Issues

### Problem: Database Connection Errors

**Symptoms:**
- "Database connection failed"
- Properties not loading
- Admin panel shows errors

**Solutions:**

1. **Check Database Status**
   - Go to your Neon.tech dashboard
   - Verify database is running
   - Check for maintenance notices

2. **Verify Connection String**
   - In Vercel dashboard, check `DATABASE_URL`
   - Should start with `postgresql://`
   - No spaces or special characters

3. **Reset Database Connection**
   - Copy fresh connection string from Neon
   - Update in Vercel environment variables
   - Redeploy your application

### Problem: Data Not Saving

**Solutions:**

1. **Check Database Limits**
   - Free plans have storage limits
   - Upgrade if you've reached the limit

2. **Verify Permissions**
   - Database user should have write permissions
   - Check connection string includes correct credentials

---

## 🚀 Deployment Issues

### Problem: Website Won't Deploy

**Symptoms:**
- Vercel shows build errors
- Deployment fails
- Website shows old version

**Solutions:**

1. **Check Build Logs**
   - In Vercel dashboard, click on failed deployment
   - Look for error messages in logs
   - Common issues: missing environment variables

2. **Verify Environment Variables**
   ```
   Required for deployment:
   ✅ DATABASE_URL
   ✅ NEXTAUTH_SECRET  
   ✅ NEXTAUTH_URL
   ✅ ADMIN_EMAIL
   ✅ ADMIN_PASSWORD
   ```

3. **Manual Redeploy**
   - In Vercel dashboard, click "Redeploy"
   - Choose "Use existing Build Cache" = NO
   - Wait for deployment to complete

### Problem: Changes Not Showing Live

**Solutions:**

1. **Force Refresh Browser**
   - Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - This bypasses cache

2. **Check Deployment Status**
   - In Vercel dashboard, verify latest deployment succeeded
   - Look for green checkmark

3. **Clear CDN Cache**
   - Changes may take 5-10 minutes to propagate
   - Try accessing from different location/device

---

## 📱 Mobile Issues

### Problem: Website Doesn't Work on Mobile

**Solutions:**

1. **Clear Mobile Browser Cache**
   - **iPhone Safari**: Settings → Safari → Clear History and Data
   - **Android Chrome**: Menu → History → Clear browsing data

2. **Test Different Mobile Browsers**
   - Safari (iPhone)
   - Chrome (Android)
   - Firefox Mobile

3. **Check Touch Interactions**
   - Make sure buttons are tappable
   - Zoom in if text is too small

---

## 🔍 Diagnostic Tools

### How to Check What's Wrong

1. **Browser Developer Console**
   ```
   1. Press F12 (or right-click → Inspect)
   2. Click "Console" tab
   3. Look for red error messages
   4. Take screenshot of errors
   ```

2. **Network Issues**
   ```
   1. In developer tools, click "Network" tab
   2. Refresh the page
   3. Look for failed requests (red status)
   4. Check if images/files are loading
   ```

3. **Vercel Deployment Logs**
   ```
   1. Go to Vercel dashboard
   2. Click on your project
   3. Click on latest deployment
   4. Check "Function Logs" for errors
   ```

---

## 🆘 When to Get Help

### Try These First
1. ✅ Restart your browser
2. ✅ Clear cache and cookies
3. ✅ Try different browser
4. ✅ Wait 10 minutes and try again
5. ✅ Check this troubleshooting guide

### Get Help If
- ❌ Problem persists after trying solutions
- ❌ You see database errors
- ❌ Deployment keeps failing
- ❌ Multiple features stop working
- ❌ Website is completely inaccessible

### How to Get Help

1. **Gather Information**
   ```
   Include in your help request:
   ✅ What you were trying to do
   ✅ What error message you see
   ✅ What browser you're using
   ✅ Screenshot of the problem
   ✅ Steps you already tried
   ```

2. **Where to Get Help**
   - Check GitHub repository issues
   - Create new issue with details
   - Include screenshots and error messages

---

## 🛠️ Prevention Tips

### Regular Maintenance

1. **Monthly Checks**
   - Test contact forms
   - Check all admin functions
   - Verify mobile responsiveness
   - Test property search and filters

2. **Keep Backups**
   - Export your properties regularly
   - Save environment variables securely
   - Keep original files safe

3. **Monitor Performance**
   - Check website loading speed
   - Test from different devices
   - Monitor database usage

### Best Practices

1. **Make Changes Gradually**
   - Test one change at a time
   - Don't modify multiple files simultaneously
   - Keep backup of working version

2. **Environment Management**
   - Don't share admin credentials
   - Use strong passwords
   - Update passwords regularly

3. **Content Management**
   - Optimize images before uploading
   - Use descriptive file names
   - Keep property information up to date

---

## 📊 Common Error Messages

### "500 Internal Server Error"
**Cause:** Server-side problem  
**Solution:** Check database connection, wait and retry

### "404 Not Found"
**Cause:** Page doesn't exist  
**Solution:** Check URL spelling, verify page exists

### "403 Forbidden"
**Cause:** Access denied  
**Solution:** Check login status, verify permissions

### "Database Connection Failed"
**Cause:** Database server issue  
**Solution:** Check database status, verify connection string

### "Build Failed"
**Cause:** Code or configuration error  
**Solution:** Check environment variables, review recent changes

---

**🎯 Remember: Most Issues Are Simple!**

95% of problems are solved by:
- Refreshing the browser
- Clearing cache
- Checking login credentials
- Waiting a few minutes
- Trying a different browser

Don't hesitate to reach out for help if you're stuck. Every problem has a solution! 🚀

**Quick Links:**
- [Installation Guide](USER_INSTALLATION_GUIDE.md) - Set up from scratch
- [Customization Guide](CUSTOMIZATION_GUIDE.md) - Make it yours  
- [Features Guide](FEATURES_GUIDE.md) - Learn what's possible