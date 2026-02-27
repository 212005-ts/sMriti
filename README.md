# sMriti - Medicine Reminder System

## Overview
sMriti is an automated medicine reminder system designed for elderly parents in India. It makes voice calls at scheduled times to remind them to take their medication, with SMS alerts sent to caregivers if doses are missed. Supports Hindi and English languages for India's diverse population.

## How It Works

### 1. Scheduling a Reminder
- Caregiver opens the web dashboard
- Fills out the form with:
  - Parent's name and phone number
  - Medicine name
  - Time for reminder (HH:MM format)
  - Caregiver's phone number
  - Language preference (Hindi/English)
  - Repeat schedule (Daily/Weekly/Monthly)
- Clicks "Schedule" button
- Reminder is stored in memory

### 2. Automated Calling Process
Every minute, the system checks all reminders:

**Step 1: Time Match**
- Checks if current time matches reminder time
- For daily: triggers every day at set time
- For weekly: triggers only on specified days (0=Sunday, 1=Monday, etc.)
- For monthly: triggers on specified date of month

**Step 2: First Call Attempt**
- System calls parent's phone number
- Voice message plays in selected language:
  - Hindi: "Namaste [Name]. Kripya apni [Medicine] lein. 1 dabaiye."
  - English: "Hello [Name]. Please take your [Medicine]. Press 1."
- Parent presses 1 to confirm → Status: TAKEN ✓
- No response → Wait 1 minute, retry

**Step 3: Retry Logic**
- If no response after first call, system waits 1 minute
- Makes second call attempt (max 2 attempts total)
- Parent presses 1 → Status: TAKEN ✓
- Still no response → Status: MISSED ✗

**Step 4: Caregiver Alert**
- If medicine is missed after all attempts
- SMS sent to caregiver: "Alert: [Parent Name] missed medicine."

### 3. Dashboard Monitoring
- Real-time status tracking
- Auto-refreshes every 5 seconds
- Shows all reminders with:
  - Parent name
  - Medicine name
  - Scheduled time
  - Repeat pattern
  - Current status (PENDING/CALLING/TAKEN/MISSED)

## Technical Architecture

### Backend (Node.js/Express)
- **Port**: 3000
- **Scheduler**: node-cron (runs every minute)
- **Storage**: In-memory array (no database)
- **Communication**: Twilio API for calls and SMS

### Frontend (React + Vite)
- **UI**: Simple form and table dashboard
- **API**: Axios for HTTP requests
- **Updates**: Polls backend every 5 seconds

### Twilio Integration
- **Voice Calls**: IVR system with digit collection
- **TwiML**: XML responses for voice prompts
- **SMS**: Fallback alerts to caregivers
- **Webhooks**: Status callbacks for call completion

## Workflow Diagram

```
┌─────────────────┐
│ Caregiver       │
│ Schedules       │
│ Reminder        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend Stores  │
│ Reminder        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cron Job        │
│ Checks Every    │
│ Minute          │
└────────┬────────┘
         │
         ▼
    Time Match?
         │
    ┌────┴────┐
    │   YES   │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Twilio Makes    │
│ Voice Call      │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Parent  │
    │ Answers │
    └────┬────┘
         │
    ┌────┴────────┐
    │             │
    ▼             ▼
Press 1?      No Response
    │             │
    ▼             ▼
 TAKEN      Retry (1 min)
              │
         ┌────┴────┐
         │ Attempt │
         │   < 2?  │
         └────┬────┘
              │
         ┌────┴────┐
         │   NO    │
         └────┬────┘
              │
              ▼
         ┌─────────┐
         │ MISSED  │
         │ SMS to  │
         │Caregiver│
         └─────────┘
```

## Key Features

### Repeat Scheduling
- **Daily**: Reminder triggers every day at set time
- **Weekly**: Specify days (e.g., 1,3,5 for Mon/Wed/Fri)
- **Monthly**: Specify date (e.g., 15 for 15th of each month)

### Bilingual Support
- **Hindi**: Uses Polly.Aditi voice
- **English**: Uses Alice voice
- Customizable per reminder

### Retry Mechanism
- 2 total attempts per reminder
- 1-minute interval between attempts
- Prevents spam while ensuring delivery

### Status Tracking
- **PENDING**: Waiting for scheduled time
- **CALLING**: Call in progress
- **TAKEN**: Medicine confirmed
- **MISSED**: No response after all attempts

## Setup Requirements

### Environment Variables (.env)
```
PORT=3000
ACCOUNT_SID=your_twilio_account_sid
AUTH_TOKEN=your_twilio_auth_token
TWILIO_NUMBER=your_twilio_phone_number
BASE_URL=http://localhost:3000
```

### Installation
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

## Limitations

1. **No Persistence**: Reminders lost on server restart (in-memory storage)
2. **No Authentication**: Anyone can access dashboard
3. **No Edit/Delete**: Can only create new reminders
4. **Single Timezone**: No timezone support
5. **No Call History**: Past calls not logged
6. **Demo Mode**: Runs without Twilio (logs to console)

## Use Case Example

**Scenario**: 75-year-old parent in Mumbai needs to take diabetes medicine (Metformin) daily at 8 AM

1. Son schedules reminder via dashboard
2. Every day at 8:00 AM, parent receives call
3. Parent hears: "Namaste Papa. Kripya apni Metformin ki goli lein. 1 dabaiye."
4. Parent presses 1 → Son sees "TAKEN" status
5. If parent doesn't respond → Call again at 8:01 AM
6. Still no response → Son gets SMS alert: "Alert: Papa missed Metformin medicine."

**Common Indian Medications Supported:**
- Blood Pressure: Amlodipine, Telmisartan, Atenolol
- Diabetes: Metformin, Glimepiride, Insulin
- Heart: Aspirin, Clopidogrel, Atorvastatin
- Thyroid: Thyroxine, Eltroxin
- Pain: Paracetamol, Diclofenac
- Vitamins: Calcium, Vitamin D3, B12

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication
- Edit/delete reminders
- Call history and analytics
- Multiple timezones
- Email notifications
- Mobile app
- Voice recording playback
