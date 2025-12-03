# Quick Fix for "Database connection error"

## The Problem

Your Vercel deployment is missing environment variables.

## The Solution (5 minutes)

### 1. Go to Vercel Dashboard

🔗 https://vercel.com/dashboard

### 2. Select Your Project

Click on `eagle-backend`

### 3. Go to Settings → Environment Variables

Click **Settings** in the top menu, then **Environment Variables** in the sidebar

### 4. Add These Variables

Click **Add New** for each:

| Variable Name           | Value                          | Environment                      |
| ----------------------- | ------------------------------ | -------------------------------- |
| `MONGO_URL`             | Your MongoDB connection string | Production, Preview, Development |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name     | Production, Preview, Development |
| `CLOUDINARY_API_KEY`    | Your Cloudinary API key        | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret     | Production, Preview, Development |

### 5. Get Your MongoDB Connection String

If you don't have it:

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<database>` with your database name

Example:

```
mongodb+srv://username:password@cluster.mongodb.net/startup?retryWrites=true&w=majority
```

### 6. MongoDB Atlas - Allow All IPs

1. In MongoDB Atlas, go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere**
4. Enter `0.0.0.0/0`
5. Click **Confirm**

### 7. Redeploy

After adding all variables:

1. Go to **Deployments** tab in Vercel
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes

### 8. Test

Visit: https://eagle-backend-delta.vercel.app/health

You should see:

```json
{
  "success": true,
  "status": "Server is running",
  "config": {
    "mongoConfigured": true,
    "cloudinaryConfigured": true,
    "dbConnected": true
  }
}
```

Then test: https://eagle-backend-delta.vercel.app/founder

## Still Not Working?

### Check Health Endpoint

Visit: https://eagle-backend-delta.vercel.app/health

- If `mongoConfigured: false` → MONGO_URL not set in Vercel
- If `cloudinaryConfigured: false` → Cloudinary variables not set
- If `dbConnected: false` → MongoDB connection failed (check Atlas IP whitelist)

### View Logs

1. Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click on latest deployment
4. Click **View Function Logs**
5. Look for error messages

## Common Mistakes

❌ **Forgot to click "Add" after entering variable**
✅ Make sure to click the "Add" button for each variable

❌ **Only added to Production**
✅ Select all three: Production, Preview, Development

❌ **MongoDB Atlas doesn't allow Vercel IPs**
✅ Add `0.0.0.0/0` to Network Access in MongoDB Atlas

❌ **Wrong MongoDB connection string format**
✅ Should start with `mongodb+srv://` and include password

❌ **Didn't redeploy after adding variables**
✅ Must redeploy for changes to take effect

## Need Help?

1. Check `/health` endpoint first
2. View Vercel function logs
3. Verify MongoDB Atlas network access
4. Test connection string locally

## Success!

Once working, update your frontend URLs:

**startupclient/app/api/url.ts:**

```typescript
const API_URL = "https://eagle-backend-delta.vercel.app/founder";
```

**startupserver/app/api/url.ts:**

```typescript
const API_URL = "https://eagle-backend-delta.vercel.app";
```
