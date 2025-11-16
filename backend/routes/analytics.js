const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../utils/auth');
const { userDb, postDb, feedbackDb } = require('../database/db');

router.get('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const posts = postDb.getAll();
    const users = userDb.getAll();
    const feedback = feedbackDb.getAll();

    const lostPosts = posts.filter(p => p.type === 'lost').length;
    const foundPosts = posts.filter(p => p.type === 'found').length;
    const resolvedPosts = posts.filter(p => p.status === 'resolved').length;
    const activePosts = posts.filter(p => p.status === 'active').length;
    const activeUsers = users.filter(u => u.isEnabled === 1).length;

    const stats = {
      totalUsers: users.length,
      totalPosts: posts.length,
      lostPosts,
      foundPosts,
      lostCount: lostPosts,
      foundCount: foundPosts,
      resolvedPosts,
      activePosts,
      activeUsers,
      totalFeedback: feedback.length,
    };

    res.json(stats);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

module.exports = router;
