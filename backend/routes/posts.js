const express = require('express');
const router = express.Router();
const stringSimilarity = require('string-similarity');
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
} = require('../utils/db');
const { authMiddleware, adminMiddleware } = require('../utils/auth');

router.get('/stats/admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const allPosts = await getAllPosts();
    const stats = {
      totalPosts: allPosts.length,
      activePosts: allPosts.filter(p => p.status === 'active').length,
      resolvedPosts: allPosts.filter(p => p.status === 'resolved').length,
      lostPosts: allPosts.filter(p => p.type === 'lost').length,
      foundPosts: allPosts.filter(p => p.type === 'found').length
    };
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, category, location, search, status, dateFrom, dateTo, user, hasImage, sortBy } = req.query;
    let posts = await getAllPosts();
    
    if (type && type !== 'all') {
      posts = posts.filter(post => post.type === type);
    }
    
    if (category && category !== 'all') {
      posts = posts.filter(post => post.category?.toLowerCase() === category.toLowerCase());
    }
    
    if (location) {
      posts = posts.filter(post => post.location?.toLowerCase().includes(location.toLowerCase()));
    }
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      posts = posts.filter(post => new Date(post.date) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      posts = posts.filter(post => new Date(post.date) <= toDate);
    }
    
    if (user) {
      const userLower = user.toLowerCase();
      posts = posts.filter(post =>
        post.user?.toLowerCase().includes(userLower) ||
        post.email?.toLowerCase().includes(userLower)
      );
    }
    
    if (hasImage === 'true') {
      posts = posts.filter(post => post.imageURL);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (status && status !== 'all') {
      posts = posts.filter(post => post.status === status);
    } else if (!status) {
      posts = posts.filter(post => post.status === 'active');
    }
    
    if (sortBy) {
      switch (sortBy) {
        case 'oldest':
          posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'updated':
          posts.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
          break;
        case 'resolved':
          posts.sort((a, b) => (b.status === 'resolved' ? 1 : 0) - (a.status === 'resolved' ? 1 : 0));
          break;
        case 'newest':
        default:
          posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my-posts', authMiddleware, async (req, res) => {
  try {
    const posts = await getUserPosts(req.user.username);
    res.json(posts);
  } catch (error) {
    console.error('Get my posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my-matches', authMiddleware, async (req, res) => {
  try {
    const userPosts = await getUserPosts(req.user.username);
    const allPosts = await getAllPosts();
    const matches = [];

    for (const userPost of userPosts) {
      if (userPost.status !== 'active') continue;
      
      const oppositeType = userPost.type === 'lost' ? 'found' : 'lost';
      const candidatePosts = allPosts.filter(p => 
        p.type === oppositeType && 
        p.status === 'active' &&
        p.user !== req.user.username
      );

      for (const candidate of candidatePosts) {
        const titleSimilarity = stringSimilarity.compareTwoStrings(
          userPost.title.toLowerCase(),
          candidate.title.toLowerCase()
        );
        const descSimilarity = stringSimilarity.compareTwoStrings(
          (userPost.description || '').toLowerCase(),
          (candidate.description || '').toLowerCase()
        );
        const categorySimilarity = userPost.category === candidate.category ? 1 : 0;
        const locationSimilarity = stringSimilarity.compareTwoStrings(
          userPost.location.toLowerCase(),
          candidate.location.toLowerCase()
        );

        const overallScore = (titleSimilarity * 0.4 + descSimilarity * 0.3 + categorySimilarity * 0.2 + locationSimilarity * 0.1);

        if (overallScore >= 0.3) {
          matches.push({
            userPost,
            matchedPost: candidate,
            score: overallScore,
            scorePercentage: Math.round(overallScore * 100)
          });
        }
      }
    }

    matches.sort((a, b) => b.score - a.score);
    res.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const allPosts = await getAllPosts();
    res.json(allPosts);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/admin/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const post = await getPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = await updatePost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (error) {
    console.error('Admin update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/export/csv', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const posts = await getAllPosts();
    
    const csv = [
      ['ID', 'Title', 'Description', 'Type', 'Category', 'Location', 'Date', 'Contact', 'Status', 'User', 'Created At', 'Admin Note'].join(','),
      ...posts.map(post => [
        post.id,
        `"${post.title.replace(/"/g, '""')}"`,
        `"${(post.description || '').replace(/"/g, '""')}"`,
        post.type,
        post.category,
        `"${post.location.replace(/"/g, '""')}"`,
        post.date,
        post.contactNumber,
        post.status,
        post.user,
        post.createdAt,
        `"${(post.adminNote || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=lostify-posts.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await getPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, description, type, category, location, date, contactInfo, imageURL } = req.body;
    
    if (!title || !type || !category || !location || !contactInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (type !== 'lost' && type !== 'found') {
      return res.status(400).json({ error: 'Type must be either "lost" or "found"' });
    }
    
    if (date) {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (inputDate > today) {
        return res.status(400).json({ error: 'Please select a valid date — future dates are not allowed.' });
      }
    }
    
    const postData = {
      title,
      description: description || '',
      type,
      category,
      location,
      date: date || new Date().toISOString(),
      contactInfo,
      imageURL: imageURL || null,
      user: req.user.username
    };
    
    const post = await createPost(postData);
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const existingPost = await getPost(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (existingPost.user !== req.user.username && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }
    
    const updatedPost = await updatePost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existingPost = await getPost(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (existingPost.user !== req.user.username && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    await deletePost(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
