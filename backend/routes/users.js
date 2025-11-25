const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../utils/auth');
const { userDb } = require('../database/db');

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await userDb.getAll();
    const userList = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.role === 'admin',
      enabled: user.isEnabled === 1,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));
    res.json(userList);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

router.put('/:userId/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await userDb.toggleEnabled(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User status updated successfully', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        enabled: user.isEnabled === 1
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

module.exports = router;
