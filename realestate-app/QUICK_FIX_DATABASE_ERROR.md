# 🚨 QUICK FIX: Database Connection Error

## The Error:
```
Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`
```

## Fix in 2 Minutes:

### 1. Open Vercel Dashboard
Go to: https://vercel.com/dashboard

### 2. Click Your Project
Click on: **real-estate-pied-nine-85**

### 3. Go to Environment Variables
- Click **Settings** (top menu)
- Click **Environment Variables** (left sidebar)

### 4. Add DATABASE_URL
Click **Add New** and paste:

| Field | Value |
|-------|-------|
| **Key** | `DATABASE_URL` |
| **Value** | `postgresql://neondb_owner:npg_38YswXVMGexc@ep-delicate-grass-a9r77zyh-pooler.gwc.azure.neon.tech/neondb?sslmode=require` |
| **Environment** | ✅ Production ✅ Preview ✅ Development |

Click **Save**

### 5. Redeploy
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Confirm **Redeploy**

## Done! 🎉
Your site should work in ~1 minute after redeployment starts.

## Still Having Issues?
Make sure you also add these:
- `NEXTAUTH_URL` = `https://real-estate-pied-nine-85.vercel.app`
- `NEXTAUTH_SECRET` = (run `openssl rand -base64 32` to generate)
- `ADMIN_EMAIL` = `admin@yourdomain.com`
- `ADMIN_PASSWORD` = `YourPassword123!`