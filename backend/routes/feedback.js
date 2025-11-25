const express = require('express');
const router = express.Router();
const { feedbackDb } = require('../database/db');
const { authMiddleware, adminMiddleware } = require('../utils/auth');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    await feedbackDb.create({ name, email, message });
    res.json({ message: 'Feedback submitted successfully. Thank you!' });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to submit feedback. Please try again later.' });
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const feedback = await feedbackDb.getAll();
    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await feedbackDb.updateStatus(req.params.id, status, req.user.id);
    
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json(feedback);
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await feedbackDb.delete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/count/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const count = await feedbackDb.getPendingCount();
    res.json({ count });
  } catch (error) {
    console.error('Get pending count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
