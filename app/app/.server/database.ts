import Database, { type Database as DatabaseType } from "better-sqlite3";
import bcryptjs from "bcryptjs";
import { config } from "./config";

const db: DatabaseType = new Database(config.dbPath);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    password_changed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add password_changed column if it doesn't exist (migration for existing DBs)
try {
  db.exec(`ALTER TABLE users ADD COLUMN password_changed INTEGER DEFAULT 0`);
} catch {
  // Column already exists
}

// Seed a default user if none exists
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
  count: number;
};

if (userCount.count === 0) {
  const hashedPassword = bcryptjs.hashSync(config.defaultPassword, 10);
  db.prepare(
    "INSERT INTO users (username, password, password_changed) VALUES (?, ?, 0)",
  ).run(config.defaultUsername, hashedPassword);
  console.log(`Default user created: username="${config.defaultUsername}"`);
}

export default db;
