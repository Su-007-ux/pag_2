"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const dbPromise = (0, sqlite_1.open)({
    filename: path_1.default.join(__dirname, '../../sqlite.db'),
    driver: sqlite3_1.default.Database,
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
exports.default = dbPromise;
