const app = require('../backend/server');

// This endpoint will be called by Vercel Cron every minute
module.exports = async (req, res) => {
  // Import the check logic
  const { checkReminders } = require('../backend/cronLogic');
  
  try {
    await checkReminders();
    res.json({ success: true, message: 'Cron job executed' });
  } catch (error) {
    console.error('[CRON] Error:', error);
    res.status(500).json({ error: error.message });
  }
};
