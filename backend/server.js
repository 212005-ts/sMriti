require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const twilio = require('twilio');

const app = express();

// Add logging middleware FIRST
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT||3000;

// Twilio Config
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const BASE_URL = process.env.BASE_URL;

let client = null;
if (accountSid && accountSid.startsWith('AC') && authToken) {
  client = twilio(accountSid, authToken);
  console.log('Twilio initialized');
} else {
  console.log('⚠️  Twilio not configured - calls/SMS disabled');
}


// In-memory DB
let reminders = [];

// Helpers
function nowHHMM() {
  return new Date().toTimeString().slice(0,5);
}
function addMinutes(date, m) {
  return new Date(date.getTime() + m*60000);
}

// ---------- CREATE REMINDER WITH REPEAT ----------
app.post('/schedule', (req, res) => {
  const { parentName, parentPhone, medicine, time, caregiverPhone, language, repeatType, daysOfWeek, dayOfMonth } = req.body;

  if (!parentName || !parentPhone || !medicine || !time || !caregiverPhone) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const reminder = {
    id: Date.now(),
    parentName,
    parentPhone,
    medicine,
    time,
    caregiverPhone,

    language: language || 'hi',

    // NEW: repeat config
    repeatType: repeatType || 'daily', // daily | weekly | monthly
    daysOfWeek: daysOfWeek || [], // [0-6]
    dayOfMonth: dayOfMonth || null,

    status: 'PENDING',
    attempts: 0,
    maxAttempts: 2,
    nextAttemptAt: null,
    lastCalledAt: null,
    inProgress: false
  };

  reminders.push(reminder);
  res.json({ success: true, reminder });
});

app.get('/reminders', (req, res) => res.json(reminders));

// Test endpoint
app.get('/test', (req, res) => {
  console.log('[TEST] Endpoint hit');
  res.json({ status: 'ok', reminders: reminders.length });
});

// ---------- SCHEDULER ----------
cron.schedule('* * * * *', () => {
  const now = new Date();
  const currentTime = nowHHMM();
  const day = now.getDay();
  const date = now.getDate();

  reminders.forEach(rem => {
    if (rem.status === 'TAKEN' || rem.status === 'MISSED') {
      // reset for next cycle
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
});

function triggerCall(rem) {
  console.log(`[TRIGGER] Triggering call for ${rem.parentName}`);
  console.log(`[TRIGGER] Attempt ${rem.attempts + 1}/${rem.maxAttempts}`);
  
  rem.attempts += 1;
  rem.inProgress = true;
  rem.status = 'CALLING';
  rem.lastCalledAt = new Date();

  makeCall(rem);
}

function makeCall(rem) {
  console.log(`[CALL] Initiating call for reminder ID: ${rem.id}`);
  console.log(`[CALL] Parent: ${rem.parentName}, Phone: ${rem.parentPhone}, Medicine: ${rem.medicine}`);
  
  if (!client) {
    console.log(`[DEMO] Would call ${rem.parentPhone} for ${rem.medicine}`);
    return;
  }
  
  const callUrl = `${BASE_URL}/voice?id=${rem.id}`;
  const statusUrl = `${BASE_URL}/status?id=${rem.id}`;
  console.log(`[CALL] Voice URL: ${callUrl}`);
  console.log(`[CALL] Status callback URL: ${statusUrl}`);
  
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

function handleNoResponse(rem) {
  console.log(`[RETRY] Handling no response for ${rem.parentName}`);
  console.log(`[RETRY] Attempts: ${rem.attempts}/${rem.maxAttempts}`);
  
  rem.inProgress = false;
  if (rem.attempts < rem.maxAttempts) {
    rem.nextAttemptAt = addMinutes(new Date(), 1);
    console.log(`[RETRY] Will retry at: ${rem.nextAttemptAt}`);
  } else {
    console.log(`[RETRY] Max attempts reached - marking as MISSED`);
    finalizeMissed(rem);
  }
}

function finalizeMissed(rem) {
  console.log(`[MISSED] Finalizing missed medicine for ${rem.parentName}`);
  rem.status = 'MISSED';
  rem.inProgress = false;
  rem.nextAttemptAt = null;

  if (client) {
    console.log(`[SMS] Sending alert to caregiver: ${rem.caregiverPhone}`);
    client.messages.create({
      to: rem.caregiverPhone,
      from: TWILIO_NUMBER,
      body: `Alert: ${rem.parentName} missed medicine.`
    })
    .then(msg => console.log(`[SMS] ✓ Alert sent. SID: ${msg.sid}`))
    .catch(err => console.error(`[SMS] ✗ Error sending SMS:`, err.message));
  } else {
    console.log(`[DEMO] Would SMS ${rem.caregiverPhone}: ${rem.parentName} missed medicine`);
  }
}

// ---------- STATUS ----------
app.get('/status', (req, res) => {
  console.log('[STATUS] GET request received');
  res.send('OK');
});

app.post('/status', (req, res) => {
  console.log('[STATUS] POST callback received');
  console.log('[STATUS] Query params:', req.query);
  console.log('[STATUS] Body:', req.body);
  console.log('[STATUS] Call Status:', req.body.CallStatus);
  
  const rem = reminders.find(r => r.id == req.query.id);
  if (!rem) {
    console.error(`[STATUS] ✗ Reminder not found for ID: ${req.query.id}`);
    return res.sendStatus(200);
  }
  
  console.log(`[STATUS] Reminder: ${rem.parentName}, Current status: ${rem.status}`);

  if (rem.status === 'TAKEN') {
    console.log('[STATUS] Medicine already marked as TAKEN');
    return res.sendStatus(200);
  }

  console.log('[STATUS] No response - handling retry logic');
  handleNoResponse(rem);
  res.sendStatus(200);
});

// ---------- VOICE ----------
const handleVoice = (req, res) => {
  try {
    console.log(`[VOICE] ${req.method} request received`);
    console.log('[VOICE] Headers:', req.headers);
    console.log('[VOICE] Query params:', req.query);
    console.log('[VOICE] Body:', req.body);
    
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    const id = req.query.id;
    
    if (!id) {
      console.error('[VOICE] ✗ No ID provided');
      twiml.say('Error: No reminder ID');
      res.type('text/xml');
      return res.send(twiml.toString());
    }
    
    const rem = reminders.find(r => r.id == id);
    
    if (!rem) {
      console.error(`[VOICE] ✗ Reminder not found for ID: ${id}`);
      console.error(`[VOICE] Available IDs: ${reminders.map(r => r.id).join(', ')}`);
      twiml.say('Error: Reminder not found');
      res.type('text/xml');
      return res.send(twiml.toString());
    }
    
    console.log(`[VOICE] ✓ Reminder found: ${rem.parentName} - ${rem.medicine}`);

    const gather = twiml.gather({ 
      numDigits: 1, 
      action: `${BASE_URL}/gather?id=${id}`, 
      method: 'POST',
      timeout: 10
    });

    const name = rem.parentName || 'aap';
    const med = rem.medicine || 'dawa';
    const lang = rem.language || 'hi';
    
    console.log(`[VOICE] Language: ${lang}, Name: ${name}, Medicine: ${med}`);

    const hi = `Namaste ${name}. Kripya apni ${med} lein. 1 dabaiye.`;
    const en = `Hello ${name}. Please take your ${med}. Press 1.`;

    if (lang === 'en') {
      console.log('[VOICE] Using English voice');
      gather.say({ voice: 'alice', language: 'en-US' }, en);
    } else {
      console.log('[VOICE] Using Hindi voice');
      gather.say({ voice: 'Polly.Aditi', language: 'hi-IN' }, hi);
    }

    twiml.hangup();
    
    const twimlString = twiml.toString();
    console.log('[VOICE] TwiML response:', twimlString);

    res.type('text/xml');
    res.send(twimlString);
  } catch (error) {
    console.error('[VOICE] ✗ Error:', error);
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    twiml.say('An error occurred');
    res.type('text/xml');
    res.send(twiml.toString());
  }
};

app.get('/voice', handleVoice);
app.post('/voice', handleVoice);

// ---------- GATHER ----------
app.post('/gather', (req, res) => {
  try {
    console.log('[GATHER] POST request received');
    console.log('[GATHER] Query params:', req.query);
    console.log('[GATHER] Body:', req.body);
    console.log('[GATHER] Digits pressed:', req.body.Digits);
    
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    const id = req.query.id;
    const rem = reminders.find(r => r.id == id);
    
    if (!rem) {
      console.error(`[GATHER] ✗ Reminder not found for ID: ${id}`);
      twiml.say('Error');
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    if (req.body.Digits === '1') {
      console.log(`[GATHER] ✓ User pressed 1 - Medicine TAKEN`);
      rem.status = 'TAKEN';
      rem.inProgress = false;
      rem.nextAttemptAt = null;

      const name = rem.parentName;
      const med = rem.medicine;

      if (rem.language === 'en') twiml.say(`Thank you ${name}. You have taken your ${med}.`);
      else twiml.say({ voice: 'Polly.Aditi', language: 'hi-IN' }, `Dhanyavaad ${name}. Aapne ${med} le li hai.`);
    } else {
      console.log(`[GATHER] ✗ Invalid input: ${req.body.Digits}`);
      twiml.say('Invalid input');
    }
    
    const twimlString = twiml.toString();
    console.log('[GATHER] TwiML response:', twimlString);

    res.type('text/xml');
    res.send(twimlString);
  } catch (error) {
    console.error('[GATHER] ✗ Error:', error);
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    twiml.say('Error');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));

