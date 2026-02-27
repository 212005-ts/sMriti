# ⚠️ IMPORTANT: Vercel Cron Limitation

## The Problem
Vercel Cron Jobs require a **Pro Plan** ($20/month). The free tier doesn't support automated cron jobs.

## Quick Demo Solution

### Option 1: Manual Trigger (For Demo)
Add a "Check Now" button in the dashboard that calls `/api/trigger-check`

### Option 2: Use External Cron Service (Free)
Use **cron-job.org** or **EasyCron** to ping your endpoint every minute:
- URL: `https://s-mriti.vercel.app/api/trigger-check`
- Method: POST
- Schedule: Every 1 minute

### Option 3: Deploy Backend to Render (Recommended for Production)
1. Deploy backend to Render.com (free tier supports cron)
2. Keep frontend on Vercel
3. Update frontend API calls to point to Render backend

## For Hackathon Demo
Use **Option 2** - Set up free cron service to ping your endpoint.

### Setup with cron-job.org:
1. Go to https://cron-job.org
2. Create free account
3. Add new cron job:
   - Title: "sMriti Reminder Check"
   - URL: `https://s-mriti.vercel.app/api/trigger-check`
   - Schedule: `* * * * *` (every minute)
   - Method: POST
4. Save and enable

This will trigger your reminder checks every minute for free!
