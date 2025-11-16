const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');
const settingsRoutes = require('./routes/settings');
const usersRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const verifyRoutes = require('./routes/verify');
const feedbackRoutes = require('./routes/feedback');
const { seedAdminUser } = require('./utils/seedAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lostify API is running' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Lostify server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  seedAdminUser();
});
