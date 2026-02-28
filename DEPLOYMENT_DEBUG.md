# Deployment Debugging Guide

## Issue: App not updating after redeployment

### Root Causes:
1. **Vercel Cache** - Frontend might be serving cached version
2. **Cron Not Running** - Vercel free tier doesn't support automated cron jobs
3. **API Connection** - Frontend might not be connecting to backend properly

## Quick Fixes:

### 1. Clear Vercel Cache
```bash
# Force new deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### 2. Check Browser Console
Open your deployed app and press F12 (Developer Tools):
- Look for `[DASHBOARD]` logs showing API URL
- Look for `[FORM]` logs when submitting
- Check for CORS or network errors

### 3. Test API Endpoints Directly
```bash
# Replace with your actual Vercel URL
curl https://your-app.vercel.app/api/test

# Check reminders
curl https://your-app.vercel.app/api/reminders

# Manual trigger
curl -X POST https://your-app.vercel.app/api/trigger-check
```

### 4. Use Manual "Check Now" Button
Since Vercel free tier doesn't support cron:
- Dashboard now has a "🔄 Check Now" button
- Click it to manually trigger reminder checks
- This replaces the automated cron job

### 5. Setup External Cron (Recommended)
Use cron-job.org to trigger checks every minute:
1. Go to https://cron-job.org
2. Create account
3. Add job:
   - URL: `https://your-app.vercel.app/api/trigger-check`
   - Schedule: `* * * * *`
   - Method: POST

## Verification Steps:

### Step 1: Check if backend is responding
```bash
curl https://your-app.vercel.app/api/test
# Should return: {"status":"ok","reminders":0}
```

### Step 2: Create a test reminder
1. Open app in browser
2. Open Developer Console (F12)
3. Go to "Get Started"
4. Fill form and submit
5. Check console for `[FORM]` logs
6. Should see API URL and response

### Step 3: Check dashboard
1. Go to Dashboard
2. Check console for `[DASHBOARD]` logs
3. Should see reminders loading
4. Click "🔄 Check Now" button
5. Wait 5 seconds for auto-refresh

### Step 4: Test call functionality
1. Click "📞 Test Call Now" on any reminder
2. Check console for `[FRONTEND]` logs
3. Should receive call on patient's phone

## Common Issues:

### Issue: "Failed to fetch" error
**Cause**: API endpoints not working
**Fix**: Check vercel.json has correct rewrites

### Issue: Reminders not triggering automatically
**Cause**: Cron not running (Vercel free tier limitation)
**Fix**: Use "Check Now" button or setup external cron

### Issue: Old version showing
**Cause**: Browser or Vercel cache
**Fix**: Hard refresh (Ctrl+Shift+R) or force redeploy

### Issue: CORS errors
**Cause**: API_BASE_URL misconfigured
**Fix**: In production, config.js should use empty string (relative URLs)

## Debug Checklist:

- [ ] Pushed latest code to GitHub
- [ ] Vercel shows successful deployment
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check browser console for errors
- [ ] Test `/api/test` endpoint
- [ ] Test `/api/reminders` endpoint
- [ ] Try "Check Now" button
- [ ] Setup external cron service

## Current Configuration:

**Frontend (config.js):**
```javascript
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001' 
  : '';  // Empty string = relative URLs in production
```

**Backend (server.js):**
- Cron only runs in non-production mode
- In production, use `/api/trigger-check` endpoint

**Vercel (vercel.json):**
- All `/api/*` routes go to `/api/index.js`
- Cron job defined but requires Pro plan

## Next Steps:

1. **Immediate**: Use "Check Now" button for manual testing
2. **Short-term**: Setup cron-job.org for automated checks
3. **Long-term**: Consider Vercel Pro or deploy backend to Render.com
