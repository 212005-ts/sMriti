# How to Fix the Application Error

## Problem
Twilio is saying "application error" because it cannot reach your server. The ngrok tunnel is not running.

## Solution

### Step 1: Start ngrok
Open a NEW terminal and run:
```bash
ngrok http 3001
```

### Step 2: Copy the ngrok URL
You'll see output like:
```
Forwarding   https://abc-def-ghi.ngrok-free.app -> http://localhost:3001
```

Copy that HTTPS URL (e.g., `https://abc-def-ghi.ngrok-free.app`)

### Step 3: Update .env file
Edit `/backend/.env` and replace the BASE_URL:
```
BASE_URL=https://abc-def-ghi.ngrok-free.app
```
(Use YOUR ngrok URL, not this example)

### Step 4: Restart the backend server
```bash
npm start
```

### Step 5: Test
Schedule a new reminder and the call should work!

## Why This Happens
- Ngrok creates temporary tunnels that expire
- Each time you restart ngrok, you get a new URL
- Twilio needs a public URL to send webhooks to your local server
- Without ngrok running, Twilio can't reach your `/voice` endpoint

## Keep Both Running
You need TWO terminals:
1. Terminal 1: `npm start` (backend server)
2. Terminal 2: `ngrok http 3001` (tunnel)
