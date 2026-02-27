# Deploy sMriti to Vercel

## ✅ Files Updated
- ✓ `vercel.json` - Vercel configuration created
- ✓ `package.json` - Root package.json for build
- ✓ `backend/server.js` - All routes now use `/api` prefix
- ✓ `frontend/src/GetStarted.jsx` - API calls updated
- ✓ `frontend/src/Dashboard.jsx` - API calls updated
- ✓ `backend/.env` - BASE_URL updated to Vercel domain

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
cd /Users/tanmay/Downloads/smirti-main
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. Configure Vercel Environment Variables

Go to: https://vercel.com/creatives714-3310s-projects/s-mriti/settings/environment-variables

Add these variables:

| Name | Value |
|------|-------|
| `ACCOUNT_SID` | `Your Twilio Account SID` |
| `AUTH_TOKEN` | `Your Twilio Auth Token` |
| `TWILIO_NUMBER` | `Your Twilio Phone Number` |
| `BASE_URL` | `https://s-mriti.vercel.app` |
| `PORT` | `3001` |
| `NODE_ENV` | `production` |

**Important:** Select "Production", "Preview", and "Development" for each variable.

### 3. Redeploy

After adding environment variables:
1. Go to "Deployments" tab
2. Click the three dots (...) on latest deployment
3. Select "Redeploy"

## 🔍 Verify Deployment

After deployment completes, test these URLs:

1. **Frontend**: https://s-mriti.vercel.app
2. **API Test**: https://s-mriti.vercel.app/api/test
3. **Reminders**: https://s-mriti.vercel.app/api/reminders

## ⚠️ Important Notes

### Cron Jobs on Vercel
Vercel serverless functions are stateless and don't support long-running cron jobs. The current `node-cron` scheduler **will not work** on Vercel.

**Solutions:**
1. **Vercel Cron Jobs** (Recommended): Use Vercel's built-in cron feature
2. **External Service**: Use services like Render, Railway, or Heroku for backend
3. **Vercel + External Cron**: Deploy frontend on Vercel, backend elsewhere

### Using Vercel Cron (Recommended)

Create `api/cron.js`:
```javascript
const reminders = require('../backend/reminders'); // Move reminders to shared module

module.exports = async (req, res) => {
  // Your cron logic here
  res.json({ success: true });
};
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron",
    "schedule": "* * * * *"
  }]
}
```

## 🎯 Alternative: Deploy Backend Separately

For full functionality with cron jobs:

1. **Backend**: Deploy to Render/Railway/Heroku (supports cron)
2. **Frontend**: Keep on Vercel
3. Update frontend API calls to point to backend URL

## 📝 Current Limitations

- ❌ Cron scheduler won't run on Vercel (serverless)
- ❌ In-memory storage will reset on each function call
- ✅ API endpoints will work
- ✅ Frontend will deploy successfully

## 💡 Recommended Architecture

```
Frontend (Vercel) → Backend (Render/Railway) → Twilio
                         ↓
                    PostgreSQL/MongoDB
```

This ensures:
- ✓ Cron jobs work properly
- ✓ Data persistence
- ✓ Scalability
