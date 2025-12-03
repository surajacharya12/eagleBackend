# Vercel Deployment Guide

## Current Issue: Database Connection Error

The error `{"success":false,"message":"Database connection error"}` means the environment variables are not set in Vercel.

## Fix: Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Select your project: `eagle-backend`
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Environment Variables

Add the following environment variables:

#### Required Variables:

1. **MONGO_URL**

   - Value: Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Environment: Production, Preview, Development

2. **CLOUDINARY_CLOUD_NAME**

   - Value: Your Cloudinary cloud name
   - Environment: Production, Preview, Development

3. **CLOUDINARY_API_KEY**

   - Value: Your Cloudinary API key
   - Environment: Production, Preview, Development

4. **CLOUDINARY_API_SECRET**

   - Value: Your Cloudinary API secret
   - Environment: Production, Preview, Development

5. **NODE_ENV** (Optional)
   - Value: `production`
   - Environment: Production

### Step 3: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Wait for deployment to complete

OR

Push a new commit to trigger automatic deployment:

```bash
git add .
git commit -m "Update environment configuration"
git push
```

## Verify Deployment

### Test the API:

1. **Home Route**

   ```
   GET https://eagle-backend-delta.vercel.app/
   ```

   Expected:

   ```json
   {
     "success": true,
     "message": "Server is running...",
     "endpoints": {...}
   }
   ```

2. **Founder Route**
   ```
   GET https://eagle-backend-delta.vercel.app/founder
   ```
   Expected:
   ```json
   {
     "success": true,
     "data": {...} or null
   }
   ```

## Common Issues & Solutions

### Issue 1: "Database configuration error: MONGO_URL not set"

**Solution**: Add MONGO_URL environment variable in Vercel dashboard

### Issue 2: "Database connection error"

**Possible causes**:

- MongoDB connection string is incorrect
- MongoDB Atlas IP whitelist doesn't include `0.0.0.0/0` (allow all)
- MongoDB user credentials are wrong
- Network/firewall issues

**Solution**:

1. Check MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
2. Verify connection string format
3. Test connection string locally first

### Issue 3: File upload errors

**Solution**: Verify all Cloudinary environment variables are set correctly

### Issue 4: CORS errors

**Solution**: The server already has CORS enabled. If issues persist, check frontend URL configuration.

## MongoDB Atlas Configuration

### Allow Vercel IP Addresses:

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Confirm**

**Note**: For production, you can restrict to specific IPs, but Vercel uses dynamic IPs, so `0.0.0.0/0` is recommended.

## Environment Variables Format

### .env (Local Development)

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3001
NODE_ENV=development
```

### Vercel Environment Variables

Same values as above, but set through Vercel dashboard (no quotes needed)

## Testing Locally Before Deployment

```bash
# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your actual values

# Test locally
npm start

# Test endpoints
curl http://localhost:3001/
curl http://localhost:3001/founder
```

## Deployment Checklist

- [ ] MongoDB Atlas allows connections from `0.0.0.0/0`
- [ ] All environment variables set in Vercel
- [ ] Environment variables applied to Production, Preview, and Development
- [ ] Code pushed to repository
- [ ] Vercel deployment successful
- [ ] API endpoints tested and working
- [ ] Frontend updated with production API URL

## Update Frontend API URL

After successful deployment, update your frontend:

### startupclient/app/api/url.ts

```typescript
const API_URL = "https://eagle-backend-delta.vercel.app/founder";
export default API_URL;
```

### startupserver/app/api/url.ts

```typescript
const API_URL = "https://eagle-backend-delta.vercel.app";
export default API_URL;
```

## Monitoring & Logs

### View Logs in Vercel:

1. Go to your project in Vercel
2. Click on **Deployments**
3. Click on a deployment
4. Click **View Function Logs**

### Check for errors:

- Database connection errors
- Missing environment variables
- API endpoint errors
- File upload issues

## Support

If you continue to have issues:

1. Check Vercel function logs
2. Verify MongoDB Atlas network access
3. Test connection string locally
4. Ensure all environment variables are set
5. Check MongoDB user permissions

## Quick Fix Commands

```bash
# Redeploy from CLI
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

## Success Indicators

✅ Home route returns JSON with endpoints
✅ Founder route returns data or null (not error)
✅ No "Database connection error" messages
✅ File uploads work (if testing with avatar)
✅ CORS allows frontend requests

Once all environment variables are set and MongoDB is configured, your API should work perfectly!
