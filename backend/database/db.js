const { db, initDb } = require("./initDb");
const crypto = require("crypto");

initDb();

function generateId() {
  return crypto.randomBytes(16).toString("hex");
}

const userDb = {
  getByUsername: (username) => {
    return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  },

  getByEmail: (email) => {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  },

  getById: (id) => {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  },

  getByGoogleId: (googleId) => {
    return db.prepare("SELECT * FROM users WHERE googleId = ?").get(googleId);
  },

  create: (userData) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO users (id, username, email, password, profilePicture, role, googleId, lastLogin)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    stmt.run(
      id,
      userData.username,
      userData.email,
      userData.password || null,
      userData.profilePicture || null,
      userData.role || "user",
      userData.googleId || null
    );

    console.log("ID: ", id);

    return userDb.getById(id);
  },

  updateLastLogin: (id) => {
    db.prepare(`UPDATE users SET lastLogin = datetime('now') WHERE id = ?`).run(
      id
    );
  },

  getAll: () => {
    return db.prepare("SELECT * FROM users ORDER BY createdAt DESC").all();
  },

  toggleEnabled: (id) => {
    const user = userDb.getById(id);
    if (!user) return null;
    const newStatus = user.isEnabled ? 0 : 1;
    db.prepare("UPDATE users SET isEnabled = ? WHERE id = ?").run(
      newStatus,
      id
    );
    return userDb.getById(id);
  },
};

const postDb = {
  create: (postData) => {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
  INSERT INTO posts (id, title, description, category, location, date, contactInfo, type, user, imageUrl, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

    stmt.run(
      id,
      postData.title,
      postData.description,
      postData.category,
      postData.location,
      postData.date,
      postData.contactInfo,
      postData.type,
      postData.user,
      postData.imageUrl || null,
      "active"
    );

    return postDb.getById(id);
  },

  getById: (id) => {
    return db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
  },

  getAll: () => {
    return db.prepare("SELECT * FROM posts ORDER BY createdAt DESC").all();
  },

  getByUser: (userId) => {
    return db
      .prepare("SELECT * FROM posts WHERE user = ? ORDER BY createdAt DESC")
      .all(userId);
  },

  update: (id, updateData) => {
    const post = postDb.getById(id);
    if (!post) return null;

    const fields = [];
    const values = [];

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    fields.push(`updatedAt = datetime('now')`);
    values.push(id);

    const stmt = db.prepare(
      `UPDATE posts SET ${fields.join(", ")} WHERE id = ?`
    );
    stmt.run(...values);

    return postDb.getById(id);
  },

  delete: (id) => {
    db.prepare("DELETE FROM posts WHERE id = ?").run(id);
    return true;
  },

  getActive: () => {
    return db
      .prepare(
        "SELECT * FROM posts WHERE status = 'active' ORDER BY createdAt DESC"
      )
      .all();
  },

  getResolved: () => {
    return db
      .prepare(
        "SELECT * FROM posts WHERE status = 'resolved' ORDER BY createdAt DESC"
      )
      .all();
  },
};

const feedbackDb = {
  create: (feedbackData) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO feedback (id, name, email, message, status)
      VALUES (?, ?, ?, ?, 'pending')
    `);

    stmt.run(id, feedbackData.name, feedbackData.email, feedbackData.message);
    return feedbackDb.getById(id);
  },

  getById: (id) => {
    return db.prepare("SELECT * FROM feedback WHERE id = ?").get(id);
  },

  getAll: () => {
    return db.prepare("SELECT * FROM feedback ORDER BY date DESC").all();
  },

  updateStatus: (id, status, resolvedBy = null) => {
    const stmt = db.prepare(`
      UPDATE feedback 
      SET status = ?, resolvedAt = ?, resolvedBy = ?
      WHERE id = ?
    `);

    const resolvedAt = status === "resolved" ? new Date().toISOString() : null;
    stmt.run(status, resolvedAt, resolvedBy, id);
    return feedbackDb.getById(id);
  },

  delete: (id) => {
    db.prepare("DELETE FROM feedback WHERE id = ?").run(id);
    return true;
  },

  getPendingCount: () => {
    const result = db
      .prepare(
        "SELECT COUNT(*) as count FROM feedback WHERE status = 'pending'"
      )
      .get();
    return result.count;
  },
};

const settingsDb = {
  getUserSettings: (userId) => {
    return db.prepare("SELECT * FROM settings WHERE userId = ?").get(userId);
  },

  setUserSettings: (userId, settings) => {
    const existing = settingsDb.getUserSettings(userId);

    if (existing) {
      const fields = [];
      const values = [];

      Object.keys(settings).forEach((key) => {
        if (settings[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(
            typeof settings[key] === "boolean"
              ? settings[key]
                ? 1
                : 0
              : settings[key]
          );
        }
      });

      fields.push(`updatedAt = datetime('now')`);
      values.push(userId);

      const stmt = db.prepare(
        `UPDATE settings SET ${fields.join(", ")} WHERE userId = ?`
      );
      stmt.run(...values);
    } else {
      const id = generateId();
      const stmt = db.prepare(`
        INSERT INTO settings (id, userId, defaultPostType, contactVisibility, whatsappPrefix, autoResolve)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        userId,
        settings.defaultPostType || "lost",
        settings.contactVisibility || "public",
        settings.whatsappPrefix !== undefined
          ? settings.whatsappPrefix
            ? 1
            : 0
          : 1,
        settings.autoResolve !== undefined ? (settings.autoResolve ? 1 : 0) : 0
      );
    }

    return settingsDb.getUserSettings(userId);
  },

  getAdminSettings: () => {
    return db.prepare("SELECT * FROM admin_settings WHERE id = 1").get();
  },

  setAdminSettings: (settings) => {
    const fields = [];
    const values = [];

    Object.keys(settings).forEach((key) => {
      if (settings[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(
          typeof settings[key] === "boolean"
            ? settings[key]
              ? 1
              : 0
            : settings[key]
        );
      }
    });

    fields.push(`updatedAt = datetime('now')`);

    const stmt = db.prepare(
      `UPDATE admin_settings SET ${fields.join(", ")} WHERE id = 1`
    );
    stmt.run(...values);

    return settingsDb.getAdminSettings();
  },
};

module.exports = {
  userDb,
  postDb,
  feedbackDb,
  settingsDb,
  db,
};
