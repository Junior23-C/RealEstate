# Vercel Setup Instructions

## Important: Root Directory Setting

When deploying to Vercel, you MUST set the **Root Directory** to `realestate-app` in your Vercel project settings.

### Steps:

1. Go to your Vercel project dashboard
2. Go to Settings → General
3. Under "Root Directory", enter: `realestate-app`
4. Click Save

### Alternative Method (During Import):

When importing the project from GitHub:
1. After selecting the repository
2. Click on "Edit" next to Root Directory
3. Enter: `realestate-app`
4. Continue with deployment

## Required Environment Variables

Add these in your Vercel project settings:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `ADMIN_EMAIL` - Admin email for initial login
- `ADMIN_PASSWORD` - Admin password for initial login

## Database Setup

1. Use Vercel Postgres (easiest):
   - Go to Storage tab in Vercel
   - Create new Postgres database
   - It will automatically add DATABASE_URL

2. Or use external PostgreSQL (Supabase, Neon, etc.)

## Troubleshooting

If you see "Couldn't find any `pages` or `app` directory":
- Make sure Root Directory is set to `realestate-app`
- Redeploy after changing the setting