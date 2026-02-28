require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const cronLogic = require('./cronLogic');

const app = express();

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  console.log(`[REQUEST] Body:`, req.body);
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT||3000;

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

function addMinutes(date, m) {
  return new Date(date.getTime() + m*60000);
}

function handleNoResponse(rem) {
  console.log(`[RETRY] ========== HANDLING NO RESPONSE ==========`);
  console.log(`[RETRY] Patient: ${rem.parentName}`);
  console.log(`[RETRY] Current attempts: ${rem.attempts}`);
  console.log(`[RETRY] Max attempts: ${rem.maxAttempts}`);
  
  rem.inProgress = false;
  
  if (rem.attempts < rem.maxAttempts) {
    rem.nextAttemptAt = addMinutes(new Date(), 1);
    console.log(`[RETRY] ✓ Will retry at: ${rem.nextAttemptAt}`);
    console.log(`[RETRY] Status remains: ${rem.status}`);
  } else {
    console.log(`[RETRY] ✗ Max attempts (${rem.maxAttempts}) reached`);
    console.log(`[RETRY] Calling finalizeMissed...`);
    cronLogic.finalizeMissed(rem);
  }
}

app.post('/api/schedule', (req, res) => {
  const { parentName, parentPhone, medicine, time, caregiverPhone, language, repeatType, daysOfWeek, dayOfMonth } = req.body;

  console.log('[SCHEDULE] ========== NEW REMINDER ==========');
  console.log('[SCHEDULE] Parent:', parentName, parentPhone);
  console.log('[SCHEDULE] Caregiver:', caregiverPhone);
  console.log('[SCHEDULE] Medicine:', medicine, 'at', time);

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
    repeatType: repeatType || 'daily',
    daysOfWeek: daysOfWeek || [],
    dayOfMonth: dayOfMonth || null,
    status: 'PENDING',
    attempts: 0,
    maxAttempts: 2,
    nextAttemptAt: null,
    lastCalledAt: null,
    inProgress: false
  };

  cronLogic.reminders.push(reminder);
  console.log('[SCHEDULE] ✓ Reminder created with ID:', reminder.id);
  res.json({ success: true, reminder });
});

app.get('/api/reminders', (req, res) => res.json(cronLogic.reminders));

app.get('/api/test', (req, res) => {
  console.log('[TEST] Endpoint hit');
  res.json({ status: 'ok', reminders: cronLogic.reminders.length });
});

app.post('/api/trigger-check', (req, res) => {
  console.log('[MANUAL] Manual check triggered');
  cronLogic.checkReminders();
  res.json({ success: true, message: 'Check triggered' });
});

app.post('/api/test-call', (req, res) => {
  const { reminderId } = req.body;
  
  console.log('[TEST-CALL] Request body:', req.body);
  console.log('[TEST-CALL] Looking for reminder ID:', reminderId);
  console.log('[TEST-CALL] Total reminders:', cronLogic.reminders.length);
  console.log('[TEST-CALL] All reminder IDs:', cronLogic.reminders.map(r => ({ id: r.id, name: r.parentName })));
  
  const rem = cronLogic.reminders.find(r => r.id == reminderId);
  
  if (!rem) {
    console.log('[TEST-CALL] ✗ Reminder not found');
    return res.status(404).json({ 
      error: 'Reminder not found',
      requestedId: reminderId,
      availableIds: cronLogic.reminders.map(r => r.id)
    });
  }
  
  console.log('[TEST-CALL] ✓ Found reminder:', rem.parentName);
  cronLogic.triggerCall(rem);
  res.json({ success: true, message: 'Call triggered' });
});

app.get('/api/status', (req, res) => {
  console.log('[STATUS] GET request received');
  res.send('OK');
});

app.post('/api/status', (req, res) => {
  console.log('[STATUS] ========== CALL STATUS CALLBACK ==========');
  console.log('[STATUS] Query:', req.query);
  console.log('[STATUS] Body:', req.body);
  console.log('[STATUS] CallStatus:', req.body.CallStatus);
  console.log('[STATUS] CallDuration:', req.body.CallDuration);
  
  const rem = cronLogic.reminders.find(r => r.id == req.query.id);
  if (!rem) {
    console.error(`[STATUS] ✗ Reminder not found for ID: ${req.query.id}`);
    return res.sendStatus(200);
  }

  console.log(`[STATUS] Current reminder status: ${rem.status}`);

  // If already TAKEN (user pressed 1), don't change it
  if (rem.status === 'TAKEN') {
    console.log('[STATUS] ✓ Medicine already confirmed as TAKEN');
    rem.inProgress = false;
    return res.sendStatus(200);
  }

  // Call completed but no digit pressed - handle retry
  if (req.body.CallStatus === 'completed') {
    console.log('[STATUS] Call completed without confirmation');
    handleNoResponse(rem);
  }

  res.sendStatus(200);
});

const handleVoice = (req, res) => {
  try {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    const id = req.query.id;
    
    if (!id) {
      twiml.say('Error: No reminder ID');
      res.type('text/xml');
      return res.send(twiml.toString());
    }
    
    const rem = cronLogic.reminders.find(r => r.id == id);
    
    if (!rem) {
      console.error(`[VOICE] ✗ Reminder not found for ID: ${id}`);
      twiml.say('Error: Reminder not found');
      res.type('text/xml');
      return res.send(twiml.toString());
    }
    
    console.log(`[VOICE] ✓ Reminder found: ${rem.parentName} - ${rem.medicine}`);

    const gather = twiml.gather({ 
      numDigits: 1, 
      action: `${BASE_URL}/api/gather?id=${id}`, 
      method: 'POST',
      timeout: 10
    });

    const name = rem.parentName || 'aap';
    const med = rem.medicine || 'dawa';
    const lang = rem.language || 'hi';

    const hi = `Namaste ${name}. Kripya apni ${med} lein. 1 dabaiye.`;
    const en = `Hello ${name}. Please take your ${med}. Press 1.`;

    if (lang === 'en') {
      gather.say({ voice: 'alice', language: 'en-US' }, en);
    } else {
      gather.say({ voice: 'Polly.Aditi', language: 'hi-IN' }, hi);
    }

    twiml.hangup();

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('[VOICE] ✗ Error:', error);
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    twiml.say('An error occurred');
    res.type('text/xml');
    res.send(twiml.toString());
  }
};

app.get('/api/voice', handleVoice);
app.post('/api/voice', handleVoice);

// Caregiver alert voice call
app.post('/api/caregiver-voice', (req, res) => {
  try {
    console.log('[CAREGIVER-VOICE] Generating alert message');
    
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    const id = req.query.id;
    
    const rem = cronLogic.reminders.find(r => r.id == id);
    
    if (!rem) {
      twiml.say('Alert: Medicine reminder missed.');
      res.type('text/xml');
      return res.send(twiml.toString());
    }
    
    const lang = rem.language || 'hi';
    
    if (lang === 'en') {
      twiml.say({ voice: 'alice', language: 'en-US' }, 
        `Alert. ${rem.parentName} has missed their ${rem.medicine} medicine after 2 call attempts. Please check on them immediately.`);
    } else {
      twiml.say({ voice: 'Polly.Aditi', language: 'hi-IN' }, 
        `Alert. ${rem.parentName} ne apni ${rem.medicine} ki dawa 2 baar call karne ke baad bhi nahi li hai. Kripya turant unse sampark karein.`);
    }
    
    console.log('[CAREGIVER-VOICE] ✓ Alert message sent');
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('[CAREGIVER-VOICE] ✗ Error:', error);
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    twiml.say('Alert: Medicine reminder missed.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

app.post('/api/gather', (req, res) => {
  try {
    console.log('[GATHER] ========== USER INPUT RECEIVED ==========');
    console.log('[GATHER] Query:', req.query);
    console.log('[GATHER] Body:', req.body);
    console.log('[GATHER] Digits pressed:', req.body.Digits);
    
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    const id = req.query.id;
    const rem = cronLogic.reminders.find(r => r.id == id);
    
    if (!rem) {
      console.error('[GATHER] ✗ Reminder not found');
      twiml.say('Error');
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    if (req.body.Digits === '1') {
      console.log(`[GATHER] ✓ SUCCESS! ${rem.parentName} pressed 1`);
      console.log(`[GATHER] Marking ${rem.medicine} as TAKEN`);
      
      rem.status = 'TAKEN';
      rem.inProgress = false;
      rem.nextAttemptAt = null;

      if (rem.language === 'en') {
        twiml.say({ voice: 'alice', language: 'en-US' }, `Thank you ${rem.parentName}. You have taken your ${rem.medicine}.`);
      } else {
        twiml.say({ voice: 'Polly.Aditi', language: 'hi-IN' }, `Dhanyavaad ${rem.parentName}. Aapne ${rem.medicine} le li hai.`);
      }
    } else {
      console.log(`[GATHER] ✗ Invalid digit: ${req.body.Digits}`);
      twiml.say('Invalid input');
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('[GATHER] ✗ Error:', error);
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    twiml.say('Error');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

module.exports = app;

const cron = require('node-cron');

if (process.env.NODE_ENV !== 'production') {
  cron.schedule('* * * * *', () => {
    cronLogic.checkReminders();
  });
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on ${PORT}`);
    console.log('Cron scheduler active');
  });
} else {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
}
