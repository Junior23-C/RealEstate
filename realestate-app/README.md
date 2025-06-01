# Premium Real Estate Platform

A modern, full-featured real estate website built with Next.js 15, TypeScript, and Prisma. Features a beautiful public-facing website for property browsing and a comprehensive admin dashboard for property management.

## 🚀 Features

### Public Website
- **Property Browsing**: Filter by type, status, bedrooms, bathrooms
- **Property Details**: Image galleries, detailed information, inquiry forms
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works perfectly on all devices
- **Contact Forms**: Property inquiries and general contact

### Admin Dashboard
- **Secure Authentication**: Role-based access control
- **Property Management**: Add, edit, delete properties with images
- **Inquiry Management**: View and manage customer inquiries
- **Dashboard Analytics**: Property statistics and recent activity
- **Image Management**: Multiple property images with primary selection

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS with CSS variables

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Junior23-C/RealEstate.git
   cd RealEstate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the website.

## 🔐 Admin Access

Use these credentials to access the admin dashboard:
- **Email**: `admin@premiumestate.com`
- **Password**: `admin123`

Access the admin dashboard at `/admin` or click the admin button in the navigation.

## 📱 Usage

### For Visitors
1. Browse properties on the homepage or `/properties`
2. Use filters to find specific types of properties
3. Click on properties to view detailed information
4. Submit inquiries for properties you're interested in
5. Use the contact page for general questions

### For Admins
1. Log in through `/admin/login`
2. View dashboard statistics and recent inquiries
3. Manage properties: add, edit, or delete listings
4. Handle customer inquiries and update their status
5. Upload multiple images for each property

## 🗄️ Database Schema

The application includes the following main models:
- **Property**: Property listings with details and images
- **PropertyImage**: Multiple images per property
- **Inquiry**: Customer inquiries about properties
- **User**: Admin users with role-based access

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## 🚀 Deployment

### Vercel (Recommended)

1. **Set up a PostgreSQL Database**:
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Neon](https://neon.tech/), or [Supabase](https://supabase.com/)
   - Get your connection string (starts with `postgresql://`)

2. **Deploy to Vercel**:
   - Push your code to GitHub
   - Import your repository in Vercel
   - Add environment variables in Vercel dashboard:
     ```
     DATABASE_URL=postgresql://your-connection-string
     NEXTAUTH_SECRET=your-production-secret-key
     NEXTAUTH_URL=https://your-domain.vercel.app
     ```
   - Deploy (Vercel will automatically run migrations)

3. **Important Notes**:
   - The app uses PostgreSQL in production (not SQLite)
   - Prisma Client is automatically generated during build
   - Database migrations run automatically on deployment

### Local Development with PostgreSQL

If you want to use PostgreSQL locally:

```bash
# Update your .env file
DATABASE_URL="postgresql://username:password@localhost:5432/realestate"

# Reset and migrate
npx prisma migrate reset
npx prisma db seed
```

### Manual Deployment

1. Set up PostgreSQL database
2. Set environment variables
3. Build: `npm run build`
4. Deploy and run: `npm start`

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.ts`
- Customize color scheme in CSS variables

### Content
- Update property types and statuses in Prisma schema
- Modify homepage content in `src/app/page.tsx`
- Update contact information in footer and contact page

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please create an issue in the GitHub repository.

---

Built with ❤️ using Next.js and modern web technologies.