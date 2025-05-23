import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPromise = open({
  filename: path.join(__dirname, '../../sqlite.db'),
  driver: sqlite3.Database,
});

(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      ip TEXT,
      date TEXT
    )
  `);
})();

(async () => {
  const db = await dbPromise;
  await db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      cardName TEXT NOT NULL,
      cardNumber TEXT NOT NULL,
      expMonth INTEGER,
      expYear INTEGER,
      cvv TEXT,
      amount REAL,
      currency TEXT,
      service TEXT,
      ip TEXT,
      date TEXT
    )
  `);
})();

export default dbPromise;
