# 🚨 QUICK FIX: Database Connection Error

## The Error:
```
Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`
```

## Fix in 2 Minutes:

### 1. Open Vercel Dashboard
Go to: https://vercel.com/dashboard

### 2. Click Your Project
Click on your Real Estate project

### 3. Go to Environment Variables
- Click **Settings** (top menu)
- Click **Environment Variables** (left sidebar)

### 4. Add DATABASE_URL
Click **Add New** and add:

| Field | Value |
|-------|-------|
| **Key** | `DATABASE_URL` |
| **Value** | Your PostgreSQL connection string from Neon/Supabase |
| **Environment** | ✅ Production ✅ Preview ✅ Development |

**IMPORTANT**: Never commit your actual database URL to git! Get your connection string from:
- **Neon**: Dashboard → Connection Details → Connection string
- **Supabase**: Settings → Database → Connection string
- **Other providers**: Check their dashboard for PostgreSQL connection details

Click **Save**

### 5. Redeploy
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Confirm **Redeploy**

## Done! 🎉
Your site should work in ~1 minute after redeployment starts.

## Still Having Issues?
Make sure you also add these environment variables:
- `NEXTAUTH_URL` = `https://your-app-name.vercel.app`
- `NEXTAUTH_SECRET` = (run `openssl rand -base64 32` to generate)
- `ADMIN_EMAIL` = Your admin email
- `ADMIN_PASSWORD` = Your secure password

## Security Note
⚠️ **NEVER** commit database credentials to your repository. Always use environment variables!