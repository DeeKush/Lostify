const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DATABASE_PATH ||
  (process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'lostify.db')
    : path.join(__dirname, 'lostify.db'));

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      profilePicture TEXT,
      role TEXT DEFAULT 'user',
      isEnabled INTEGER DEFAULT 1,
      googleId TEXT UNIQUE,
      createdAt TEXT DEFAULT (datetime('now')),
      lastLogin TEXT
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      contactInfo TEXT NOT NULL,
      type TEXT NOT NULL,
      user TEXT NOT NULL,
      username TEXT NOT NULL,
      imageUrl TEXT,
      status TEXT DEFAULT 'active',
      flagged INTEGER DEFAULT 0,
      adminNotes TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      date TEXT DEFAULT (datetime('now')),
      resolvedAt TEXT,
      resolvedBy TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      defaultPostType TEXT DEFAULT 'lost',
      contactVisibility TEXT DEFAULT 'public',
      whatsappPrefix INTEGER DEFAULT 1,
      autoResolve INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(userId)
    );

    CREATE TABLE IF NOT EXISTS admin_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      moderationThreshold INTEGER DEFAULT 3,
      requireManualApproval INTEGER DEFAULT 0,
      announcementBanner TEXT,
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user);
    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
    CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_googleId ON users(googleId);
  `);

  const adminSettingsExists = db.prepare('SELECT COUNT(*) as count FROM admin_settings').get();
  if (adminSettingsExists.count === 0) {
    db.prepare(`
      INSERT INTO admin_settings (id, moderationThreshold, requireManualApproval)
      VALUES (1, 3, 0)
    `).run();
  }

  console.log(`✅ Database initialized successfully at: ${dbPath}`);
};

module.exports = { db, initDb };
