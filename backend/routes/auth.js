const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const { userDb } = require('../database/db');
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google/getall', async (req, res) => {

  console.log('Received request to get all users with credentials:', req.body);
  const credential = req.body;
  try {
    console.log('Verifying Google credential...');
    if (credential.type == 'admin') {
      console.log('Verifying...');
      const AllUsers = await userDb.getAll();
      const userList = AllUsers.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.role === 'admin',
        enabled: user.isEnabled === 1,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }));
      
      console.log('Admin fetching all users:', userList);
      return res.json(userList);
    }
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ error: 'Failed to load users' });
  }
  
});

router.post('/google', async (req, res) => {
  console.log('Received Google auth request:', req.body.type);
  try {
    console.log('Google credential:', credential.type);
    
    
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name;
    const picture = payload.picture;

    if (!email.endsWith('@sst.scaler.com')) {
      return res.status(403).json({ 
        error: 'Access denied. Only @sst.scaler.com email addresses are allowed.' 
      });
    }

    let user = await userDb.getByEmail(email);
    
    if (!user) {
      user = await userDb.getByGoogleId(googleId);
    }

    if (!user) {
      const username = email.split('@')[0];
      let finalUsername = username;
      let counter = 1;
      
      while (await userDb.getByUsername(finalUsername)) {
        finalUsername = `${username}${counter}`;
        counter++;
      }

      user = await userDb.create({
        username: finalUsername,
        email: email,
        googleId: googleId,
        profilePicture: picture,
        role: 'user'
      });
      
      console.log(`✅ New user created via Google: ${email}`);
    } else {
      await userDb.updateLastLogin(user.id);
    }

    if (!user.isEnabled) {
      return res.status(403).json({ error: 'Account is disabled. Please contact admin.' });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.role === 'admin',
      profilePicture: user.profilePicture
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.role === 'admin',
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = await userDb.getByUsername(username);
    
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    await userDb.updateLastLogin(user.id);
    
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: true
    });

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/verify', (req, res) => {
  res.json({ success: true });
});

module.exports = router;
