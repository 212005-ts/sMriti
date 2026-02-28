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
  console.log(`[CALL] ========== CALL DETAILS ==========`);
  console.log(`[CALL] Reminder ID: ${rem.id}`);
  console.log(`[CALL] Parent: ${rem.parentName}`);
  console.log(`[CALL] Phone: ${rem.parentPhone}`);
  console.log(`[CALL] Medicine: ${rem.medicine}`);
  console.log(`[CALL] Language: ${rem.language}`);
  console.log(`[CALL] Client initialized: ${client ? 'YES' : 'NO'}`);
  console.log(`[CALL] TWILIO_NUMBER: ${TWILIO_NUMBER}`);
  console.log(`[CALL] BASE_URL: ${BASE_URL}`);
  
  if (!client) {
    console.log(`[DEMO] ⚠️  Twilio client NOT initialized`);
    console.log(`[DEMO] ACCOUNT_SID: ${accountSid ? 'SET' : 'MISSING'}`);
    console.log(`[DEMO] AUTH_TOKEN: ${authToken ? 'SET' : 'MISSING'}`);
    return;
  }
  
  const callUrl = `${BASE_URL}/api/voice?id=${rem.id}`;
  const statusUrl = `${BASE_URL}/api/status?id=${rem.id}`;
  console.log(`[CALL] Voice URL: ${callUrl}`);
  console.log(`[CALL] Status URL: ${statusUrl}`);
  console.log(`[CALL] Making Twilio API call...`);
  
  // Safety timeout: if status callback doesn't fire in 20 seconds, reset inProgress
  const safetyTimeout = setTimeout(() => {
    if (rem.inProgress && rem.status !== 'TAKEN') {
      console.log(`[CALL] ⚠️  Safety timeout - status callback didn't fire`);
      console.log(`[CALL] Manually triggering handleNoResponse`);
      rem.inProgress = false;
      if (rem.attempts < rem.maxAttempts) {
        rem.nextAttemptAt = addMinutes(new Date(), 1);
        console.log(`[CALL] Will retry at: ${rem.nextAttemptAt}`);
      } else {
        finalizeMissed(rem);
      }
    }
  }, 20000); // 20 seconds
  
  client.calls.create({
    to: rem.parentPhone,
    from: TWILIO_NUMBER,
    url: callUrl,
    statusCallback: statusUrl,
    statusCallbackEvent: ['completed'],
    statusCallbackMethod: 'POST'
  })
  .then(call => {
    console.log(`[CALL] ✓ SUCCESS! Call SID: ${call.sid}`);
    console.log(`[CALL] Status: ${call.status}`);
  })
  .catch(err => {
    console.error(`[CALL] ✗ ERROR: ${err.message}`);
    console.error(`[CALL] Error code: ${err.code}`);
    console.error(`[CALL] Full error:`, JSON.stringify(err, null, 2));
    clearTimeout(safetyTimeout);
    rem.inProgress = false;
  });
}

function finalizeMissed(rem) {
  console.log(`[MISSED] ========== MEDICINE MISSED ==========`);
  console.log(`[MISSED] Patient: ${rem.parentName}`);
  console.log(`[MISSED] Medicine: ${rem.medicine}`);
  console.log(`[MISSED] Attempts made: ${rem.attempts}/${rem.maxAttempts}`);
  
  rem.status = 'MISSED';
  rem.inProgress = false;
  rem.nextAttemptAt = null;

  if (client) {
    // Call caregiver instead of SMS
    console.log(`[CAREGIVER-CALL] Calling caregiver: ${rem.caregiverPhone}`);
    
    const callUrl = `${BASE_URL}/api/caregiver-voice?id=${rem.id}`;
    
    client.calls.create({
      to: rem.caregiverPhone,
      from: TWILIO_NUMBER,
      url: callUrl,
      method: 'POST'
    })
    .then(call => {
      console.log(`[CAREGIVER-CALL] ✓ Call to caregiver initiated. SID: ${call.sid}`);
    })
    .catch(err => {
      console.error(`[CAREGIVER-CALL] ✗ Error:`, err.message);
      // Fallback to SMS if call fails
      console.log(`[SMS] Sending SMS as fallback`);
      client.messages.create({
        to: rem.caregiverPhone,
        from: TWILIO_NUMBER,
        body: `Alert: ${rem.parentName} missed ${rem.medicine} medicine after 2 attempts.`
      })
      .then(msg => console.log(`[SMS] ✓ Alert sent. SID: ${msg.sid}`))
      .catch(err => console.error(`[SMS] ✗ Error:`, err.message));
    });
  }
}

function checkReminders() {
  const now = new Date();
  const currentTime = nowHHMM();
  const day = now.getDay();
  const date = now.getDate();

  console.log(`[CRON] ========== CHECKING REMINDERS ==========`);
  console.log(`[CRON] Current time: ${currentTime}`);
  console.log(`[CRON] Total reminders: ${reminders.length}`);

  reminders.forEach(rem => {
    console.log(`[CRON] Checking reminder: ${rem.parentName} - ${rem.medicine}`);
    console.log(`[CRON]   Scheduled time: ${rem.time}`);
    console.log(`[CRON]   Status: ${rem.status}, Attempts: ${rem.attempts}/${rem.maxAttempts}`);
    console.log(`[CRON]   InProgress: ${rem.inProgress}`);
    console.log(`[CRON]   NextAttemptAt: ${rem.nextAttemptAt}`);
    
    if (rem.status === 'TAKEN' || rem.status === 'MISSED') {
      if (rem.repeatType !== 'once') {
        rem.status = 'PENDING';
        rem.attempts = 0;
      }
    }

    if (rem.inProgress) {
      console.log(`[CRON]   Skipping - call in progress`);
      return;
    }

    let shouldTrigger = false;

    if (rem.repeatType === 'daily') {
      shouldTrigger = (rem.time === currentTime);
      console.log(`[CRON]   Daily check: ${rem.time} === ${currentTime}? ${shouldTrigger}`);
    }

    if (rem.repeatType === 'weekly') {
      shouldTrigger = (rem.daysOfWeek.includes(day) && rem.time === currentTime);
    }

    if (rem.repeatType === 'monthly') {
      shouldTrigger = (rem.dayOfMonth === date && rem.time === currentTime);
    }

    if (shouldTrigger && rem.attempts === 0) {
      console.log(`[CRON]   ✓ Time match - triggering first call`);
      triggerCall(rem);
      return;
    }

    if (rem.nextAttemptAt) {
      console.log(`[CRON]   Checking retry: now=${now.toISOString()}, nextAttempt=${new Date(rem.nextAttemptAt).toISOString()}`);
      if (now >= new Date(rem.nextAttemptAt)) {
        console.log(`[CRON]   ✓ Retry time reached`);
        if (rem.attempts < rem.maxAttempts) {
          console.log(`[CRON]   ✓ Triggering retry call`);
          triggerCall(rem);
        } else {
          console.log(`[CRON]   ✗ Max attempts reached - finalizing as missed`);
          finalizeMissed(rem);
        }
      }
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
