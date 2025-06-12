# 🎨 Customization Guide - Make It Yours!

Transform your real estate website to match your brand and style. This guide shows you exactly how to customize colors, text, images, and settings without any technical knowledge required.

## 📋 What You Can Customize

✅ **Company Information** - Name, contact details, hours  
✅ **Colors & Branding** - Logo, colors, fonts  
✅ **Homepage Content** - Hero text, featured properties  
✅ **Property Types** - Add/remove property categories  
✅ **Contact Information** - Phone, email, address  
✅ **Business Hours** - Operating hours display  
✅ **Email Notifications** - Automated messages  

---

## 🏢 Step 1: Update Company Information

### Through Admin Panel (Easiest Way)

1. **Log into Admin Panel**
   - Go to `your-website.com/admin`
   - Enter your admin email and password
   - Click "Login"

2. **Access Settings**
   - Look for "Settings" in the left menu
   - Click on it to expand options
   - Select "Company Info" or "Contact Settings"

3. **Update Your Information**
   ```
   Company Name: Your Real Estate Company
   Email: info@yourcompany.com
   Phone: (555) 123-4567
   Address: 123 Main Street
   City: Your City
   State: Your State
   ZIP Code: 12345
   ```

4. **Set Business Hours**
   - Monday: 9:00 AM - 6:00 PM
   - Tuesday: 9:00 AM - 6:00 PM
   - Wednesday: 9:00 AM - 6:00 PM
   - Thursday: 9:00 AM - 6:00 PM
   - Friday: 9:00 AM - 6:00 PM
   - Saturday: 10:00 AM - 4:00 PM
   - Sunday: Closed

5. **Save Changes**
   - Click the "Save" or "Update" button
   - Your changes will appear immediately on your website

---

## 🎨 Step 2: Customize Colors and Appearance

### Option A: Simple Color Changes (Recommended)

1. **Access Theme Settings**
   - In admin panel, look for "Appearance" or "Theme Settings"
   - Or edit the file directly (see Option B below)

2. **Choose Your Brand Colors**
   - **Primary Color** (buttons, links): Choose your brand color
   - **Secondary Color** (backgrounds): Usually a lighter shade
   - **Text Color** (headings): Usually dark gray or black
   - **Background Color** (main background): Usually white or light gray

### Option B: Edit CSS File (More Control)

1. **Find the CSS File**
   - Open your project folder
   - Navigate to: `src/app/globals.css`
   - Open it with a text editor (Notepad++, VS Code, or even Notepad)

2. **Update Color Variables**
   Look for this section and change the values:
   ```css
   :root {
     --primary: 221.2 83.2% 53.3%;        /* Main brand color */
     --secondary: 210 40% 96.1%;          /* Secondary color */
     --background: 0 0% 100%;             /* Background (white) */
     --foreground: 222.2 84% 4.9%;        /* Text color (dark) */
   }
   ```

3. **Color Format Explanation**
   The numbers represent HSL (Hue, Saturation, Lightness):
   - **Hue** (0-360): The color itself (0=red, 120=green, 240=blue)
   - **Saturation** (0-100%): How vivid the color is
   - **Lightness** (0-100%): How light or dark the color is

4. **Easy Color Picker**
   - Use [hslpicker.com](https://hslpicker.com) to find your colors
   - Pick your color and copy the HSL values
   - Replace the numbers in the CSS file

### Popular Color Combinations

**Professional Blue:**
```css
--primary: 210 100% 50%;     /* Blue */
--secondary: 210 40% 95%;    /* Light blue */
```

**Elegant Gold:**
```css
--primary: 45 100% 50%;      /* Gold */
--secondary: 45 40% 95%;     /* Light gold */
```

**Modern Green:**
```css
--primary: 120 60% 45%;      /* Green */
--secondary: 120 40% 95%;    /* Light green */
```

**Classic Red:**
```css
--primary: 0 70% 50%;        /* Red */
--secondary: 0 40% 95%;      /* Light red */
```

---

## 📝 Step 3: Customize Homepage Text

### Main Hero Section

1. **Find the Homepage File**
   - Open: `src/app/page.tsx`
   - Look for the hero section (usually near the top)

2. **Update the Main Headline**
   Find this line and change it:
   ```typescript
   <h1 className="text-4xl font-bold">
     Find Your Dream Home Today
   </h1>
   ```
   
   Change to your text:
   ```typescript
   <h1 className="text-4xl font-bold">
     Your Custom Headline Here
   </h1>
   ```

3. **Update the Subtitle**
   Find and update:
   ```typescript
   <p className="text-xl text-muted-foreground">
     Discover the perfect property with our expert guidance
   </p>
   ```

### Navigation Menu

1. **Update Menu Items**
   - Open: `src/components/navbar.tsx`
   - Find the navigation links
   - Update text as needed:
   ```typescript
   { name: "Home", href: "/" },
   { name: "Properties", href: "/properties" },
   { name: "About Us", href: "/about" },
   { name: "Contact", href: "/contact" }
   ```

### Footer Information

1. **Update Footer Text**
   - Open: `src/components/footer.tsx`
   - Find and update your company description
   - Update social media links
   - Update contact information

---

## 🏠 Step 4: Customize Property Types

### Add New Property Types

1. **Edit Database Schema**
   - Open: `prisma/schema.prisma`
   - Find the `PropertyType` enum:
   ```prisma
   enum PropertyType {
     HOUSE
     APARTMENT
     CONDO
     TOWNHOUSE
     LAND
     COMMERCIAL
   }
   ```

2. **Add Your Custom Types**
   ```prisma
   enum PropertyType {
     HOUSE
     APARTMENT
     CONDO
     TOWNHOUSE
     LAND
     COMMERCIAL
     VILLA
     STUDIO
     DUPLEX
   }
   ```

3. **Update the Database**
   Run in terminal:
   ```
   npx prisma migrate dev --name add-property-types
   ```

### Update Display Names

1. **Edit Property Form**
   - Open: `src/app/admin/properties/property-form.tsx`
   - Find the property type options
   - Update the display names:
   ```typescript
   <option value="HOUSE">Single Family Home</option>
   <option value="APARTMENT">Apartment</option>
   <option value="VILLA">Luxury Villa</option>
   ```

---

## 📧 Step 5: Customize Email Notifications

### Update Email Templates

1. **Find Notification Service**
   - Open: `src/lib/notifications/email.ts`
   - Look for email templates

2. **Customize Welcome Email**
   ```typescript
   const emailContent = `
   Dear ${inquiry.name},
   
   Thank you for your interest in ${propertyTitle}!
   
   Our team will contact you within 24 hours to discuss
   your requirements and schedule a viewing.
   
   Best regards,
   ${companyName} Team
   
   Phone: ${companyPhone}
   Email: ${companyEmail}
   `
   ```

3. **Update Email Signatures**
   - Add your company logo
   - Include social media links
   - Add professional disclaimers

---

## 🖼️ Step 6: Add Your Logo and Images

### Upload Company Logo

1. **Prepare Your Logo**
   - Recommended size: 200x80 pixels
   - Format: PNG with transparent background
   - File name: `logo.png`

2. **Add to Project**
   - Put your logo in: `public/logo.png`
   - Or upload through admin panel if available

3. **Update Logo References**
   - Open: `src/components/navbar.tsx`
   - Find the logo image tag
   - Update the source:
   ```typescript
   <Image 
     src="/logo.png" 
     alt="Your Company Name"
     width={200}
     height={80}
   />
   ```

### Default Property Images

1. **Replace Sample Images**
   - Add your images to: `public/images/`
   - Use high-quality photos (1200x800 minimum)
   - Name them clearly: `sample-house.jpg`, `sample-apartment.jpg`

2. **Update Image References**
   - Check the seed file: `prisma/seed.ts`
   - Replace image URLs with your own

---

## ⚙️ Step 7: Advanced Customizations

### Change Fonts

1. **Google Fonts Integration**
   - Open: `src/app/layout.tsx`
   - Add your Google Font:
   ```typescript
   import { Inter, Playfair_Display } from 'next/font/google'
   
   const inter = Inter({ subsets: ['latin'] })
   const playfair = Playfair_Display({ subsets: ['latin'] })
   ```

2. **Update CSS Variables**
   ```css
   :root {
     --font-heading: 'Playfair Display', serif;
     --font-body: 'Inter', sans-serif;
   }
   ```

### Custom CSS Styles

1. **Add Custom Styles**
   - Open: `src/app/globals.css`
   - Add your custom CSS at the bottom:
   ```css
   /* Your Custom Styles */
   .custom-button {
     background: linear-gradient(45deg, #your-color1, #your-color2);
     border-radius: 25px;
     padding: 12px 24px;
   }
   
   .custom-card {
     box-shadow: 0 10px 25px rgba(0,0,0,0.1);
     border-radius: 15px;
   }
   ```

### Mobile Responsiveness

All customizations automatically work on mobile devices, but you can add mobile-specific styles:

```css
/* Mobile-specific styles */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .property-card {
    margin-bottom: 1rem;
  }
}
```

---

## 🚀 Step 8: Apply Your Changes

### For Vercel Deployment

1. **Save All Changes**
   - Save all files you've edited
   - Make sure everything looks right

2. **Upload to GitHub**
   - Go to your GitHub repository
   - Upload your changed files
   - Or use GitHub Desktop app

3. **Automatic Deployment**
   - Vercel will automatically detect changes
   - Your website will update in 2-3 minutes
   - Check your live website to see changes

### For Local Testing

1. **Restart Development Server**
   ```
   npm run dev
   ```

2. **Check Your Changes**
   - Open: `http://localhost:3000`
   - Verify all customizations look correct
   - Test on mobile by resizing browser window

---

## 📱 Testing Your Customizations

### Checklist

✅ **Desktop View**
- Homepage loads correctly
- Navigation works
- Colors look good
- Text is readable
- Images display properly

✅ **Mobile View**
- Responsive design works
- Menu collapses properly
- Touch interactions work
- Text remains readable

✅ **Admin Panel**
- Settings save correctly
- Forms work properly
- All features function

✅ **Functionality**
- Contact forms work
- Property searches work
- All links work
- Images load quickly

---

## 💡 Pro Tips

### Design Best Practices

1. **Keep It Simple**
   - Don't use too many colors
   - Maintain good contrast for readability
   - Use consistent spacing

2. **Brand Consistency**
   - Use the same colors throughout
   - Keep fonts consistent
   - Use your logo consistently

3. **Mobile First**
   - Test on mobile devices
   - Ensure buttons are large enough
   - Keep navigation simple

### Performance Tips

1. **Optimize Images**
   - Compress images before uploading
   - Use appropriate file formats (JPEG for photos, PNG for logos)
   - Don't use images larger than needed

2. **Test Loading Speed**
   - Use tools like PageSpeed Insights
   - Optimize if loading takes longer than 3 seconds

---

## 🆘 Need Help?

### Common Issues

**Q: My colors aren't changing**
A: Make sure you saved the CSS file and refreshed your browser

**Q: Images aren't showing**
A: Check file paths and make sure images are in the correct folder

**Q: Changes aren't live on my website**
A: For Vercel, make sure you uploaded changes to GitHub

**Q: Mobile view looks broken**
A: Test responsiveness and check for CSS conflicts

### Getting Support

1. Check the [Troubleshooting Guide](TROUBLESHOOTING_GUIDE.md)
2. Review your changes step by step
3. Test in different browsers
4. Ask for help on GitHub if needed

---

**🎉 You're Now a Customization Expert!**

Your real estate website should now reflect your unique brand and style. Remember:

- Make changes gradually and test each one
- Keep backups of your original files
- Don't be afraid to experiment
- Most changes can be easily reversed

**Next Steps:**
- Add your real properties and photos
- Set up email notifications
- Consider adding custom pages
- Explore advanced features

Your website is now truly yours! 🏠✨