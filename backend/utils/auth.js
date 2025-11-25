const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set!');
  console.error('Please configure JWT_SECRET in your environment or Replit Secrets.');
  process.exit(1);
}

function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id || user.username,
      username: user.username, 
      email: user.email, 
      isAdmin: user.isAdmin || false 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  if (!decoded.id) {
    return res.status(401).json({ error: 'Token missing required fields - please log in again' });
  }
  
  req.user = decoded;
  next();
}

function adminMiddleware(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authMiddleware,
  adminMiddleware
};
