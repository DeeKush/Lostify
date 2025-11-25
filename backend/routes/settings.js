const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../utils/auth');
const { settingsDb } = require('../database/db');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const settings = await settingsDb.getUserSettings(req.user.id);
    res.json(settings || {
      defaultPostType: 'lost',
      contactVisibility: 'public',
      whatsappPrefix: 1,
      autoResolve: 0,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const settings = await settingsDb.setUserSettings(req.user.id, req.body);
    res.json({ message: 'Settings saved successfully', settings });
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

router.get('/admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const adminSettings = await settingsDb.getAdminSettings();
    res.json(adminSettings || {
      moderationThreshold: 3,
      requireManualApproval: 0,
      announcementBanner: '',
    });
  } catch (error) {
    console.error('Get admin settings error:', error);
    res.status(500).json({ error: 'Failed to load admin settings' });
  }
});

router.put('/admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const adminSettings = await settingsDb.setAdminSettings(req.body);
    res.json({ message: 'Admin settings saved successfully', adminSettings });
  } catch (error) {
    console.error('Save admin settings error:', error);
    res.status(500).json({ error: 'Failed to save admin settings' });
  }
});

module.exports = router;
