# Running sMriti on Localhost

## Quick Start

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

Backend will run on: http://localhost:3001

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

## Testing the App

1. **Open Frontend**: http://localhost:5173
2. **Schedule a Reminder**:
   - Go to "Get Started"
   - Fill in the form
   - Set time to current time + 1 minute (e.g., if it's 10:30, set 10:31)
   - Click "Schedule Reminder"

3. **View Dashboard**: http://localhost:5173/dashboard
   - See your reminder with status "PENDING"
   - Click "📞 Test Call Now" button to trigger immediate call
   - OR wait for scheduled time (cron runs every minute)

## Manual Testing Endpoints

### Test if backend is running:
```bash
curl http://localhost:3001/api/test
```

### Get all reminders:
```bash
curl http://localhost:3001/api/reminders
```

### Trigger cron check manually:
```bash
curl -X POST http://localhost:3001/api/trigger-check
```

### Test call for specific reminder:
```bash
curl -X POST http://localhost:3001/api/test-call \
  -H "Content-Type: application/json" \
  -d '{"reminderId": YOUR_REMINDER_ID}'
```

## Environment Variables

Make sure `backend/.env` has:
```
ACCOUNT_SID=your_twilio_account_sid
AUTH_TOKEN=your_twilio_auth_token
TWILIO_NUMBER=your_twilio_phone_number
BASE_URL=http://localhost:3001
PORT=3001
```

## Troubleshooting

### Port 3001 already in use:
```bash
lsof -ti:3001 | xargs kill -9
```

### Calls not working:
1. Check Twilio credentials in `.env`
2. Check console logs in backend terminal
3. Use "Test Call Now" button in dashboard
4. Verify phone number format: +919876543210

### Frontend can't connect to backend:
1. Make sure backend is running on port 3001
2. Check browser console for errors
3. Verify `frontend/src/config.js` has correct API_BASE_URL

## How It Works

1. **Cron Job**: Runs every minute, checks if any reminder time matches current time
2. **Time Format**: Uses HH:MM (24-hour format)
3. **Retry Logic**: 2 attempts with 1-minute gap
4. **Status Flow**: PENDING → CALLING → TAKEN/MISSED

## Demo Tips

- Set reminder time to current time + 1 minute for quick demo
- Use "Test Call Now" button for instant testing
- Check backend terminal for detailed logs
- Dashboard auto-refreshes every 5 seconds
