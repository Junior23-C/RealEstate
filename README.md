# Real Estate Management Application

A comprehensive real estate management platform built with Next.js, featuring property listings, admin dashboard, and rental management.

## Project Structure

The Next.js application is located in the `realestate-app` directory.

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` file in the root directory tells Vercel to use `realestate-app` as the root directory for the Next.js application.

### Environment Variables Required

See `realestate-app/VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

## Local Development

```bash
cd realestate-app
npm install
npm run dev
```

## Tech Stack

- Next.js 15
- TypeScript
- Prisma ORM
- PostgreSQL (production) / SQLite (development)
- Tailwind CSS
- NextAuth.js for authentication

## Features

- Property listings with search and filtering
- Admin dashboard for property management
- Rental and tenant management system
- Contact forms and inquiry tracking
- Responsive design
- Authentication and authorization

## Recent Updates

- Fixed async Client Component errors
- Fixed PrismaClient browser environment issues
- Fixed 404 errors on property detail pages
- Configured for Vercel deployment with PostgreSQL