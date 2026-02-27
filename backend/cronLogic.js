require('dotenv').config();
const twilio = require('twilio');

// Twilio Config
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const BASE_URL = process.env.BASE_URL;

let client = null;
if (accountSid && accountSid.startsWith('AC') && authToken) {
  client = twilio(accountSid, authToken);
}

// Shared reminders array (in production, use database)
let reminders = [];

function nowHHMM() {
  return new Date().toTimeString().slice(0,5);
}

function addMinutes(date, m) {
  return new Date(date.getTime() + m*60000);
}

function triggerCall(rem) {
  console.log(`[TRIGGER] Triggering call for ${rem.parentName}`);
  
  rem.attempts += 1;
  rem.inProgress = true;
  rem.status = 'CALLING';
  rem.lastCalledAt = new Date();

  makeCall(rem);
}

function makeCall(rem) {
  console.log(`[CALL] Initiating call for reminder ID: ${rem.id}`);
  
  if (!client) {
    console.log(`[DEMO] Would call ${rem.parentPhone} for ${rem.medicine}`);
    return;
  }
  
  const callUrl = `${BASE_URL}/api/voice?id=${rem.id}`;
  const statusUrl = `${BASE_URL}/api/status?id=${rem.id}`;
  
  client.calls.create({
    to: rem.parentPhone,
    from: TWILIO_NUMBER,
    url: callUrl,
    statusCallback: statusUrl,
    statusCallbackEvent: ['completed'],
    statusCallbackMethod: 'POST'
  })
  .then(call => {
    console.log(`[CALL] ✓ Call created successfully. SID: ${call.sid}`);
  })
  .catch(err => {
    console.error(`[CALL] ✗ Error creating call:`, err.message);
    rem.inProgress = false;
  });
}

function finalizeMissed(rem) {
  console.log(`[MISSED] Finalizing missed medicine for ${rem.parentName}`);
  rem.status = 'MISSED';
  rem.inProgress = false;
  rem.nextAttemptAt = null;

  if (client) {
    client.messages.create({
      to: rem.caregiverPhone,
      from: TWILIO_NUMBER,
      body: `Alert: ${rem.parentName} missed medicine.`
    })
    .then(msg => console.log(`[SMS] ✓ Alert sent. SID: ${msg.sid}`))
    .catch(err => console.error(`[SMS] ✗ Error sending SMS:`, err.message));
  }
}

function checkReminders() {
  const now = new Date();
  const currentTime = nowHHMM();
  const day = now.getDay();
  const date = now.getDate();

  console.log(`[CRON] Checking reminders at ${currentTime}`);

  reminders.forEach(rem => {
    if (rem.status === 'TAKEN' || rem.status === 'MISSED') {
      if (rem.repeatType !== 'once') {
        rem.status = 'PENDING';
        rem.attempts = 0;
      }
    }

    if (rem.inProgress) return;

    let shouldTrigger = false;

    if (rem.repeatType === 'daily') {
      shouldTrigger = (rem.time === currentTime);
    }

    if (rem.repeatType === 'weekly') {
      shouldTrigger = (rem.daysOfWeek.includes(day) && rem.time === currentTime);
    }

    if (rem.repeatType === 'monthly') {
      shouldTrigger = (rem.dayOfMonth === date && rem.time === currentTime);
    }

    if (shouldTrigger && rem.attempts === 0) {
      triggerCall(rem);
      return;
    }

    if (rem.nextAttemptAt && now >= new Date(rem.nextAttemptAt)) {
      if (rem.attempts < rem.maxAttempts) triggerCall(rem);
      else finalizeMissed(rem);
    }
  });
}

module.exports = {
  reminders,
  checkReminders,
  triggerCall,
  makeCall,
  finalizeMissed
};
