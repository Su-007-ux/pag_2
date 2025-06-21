import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

/**
 * Inicializa y exporta una promesa de conexión a la base de datos SQLite.
 * La base de datos se encuentra en la raíz del proyecto como 'sqlite.db'.
 */
const dbPromise = open({
  filename: path.join(__dirname, '../../sqlite.db'),
  driver: sqlite3.Database,
});

/**
 * Crea la tabla 'contacts' si no existe.
 * Esta tabla almacena los mensajes enviados desde el formulario de contacto.
  */

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

/**
 * Crea la tabla 'payments' si no existe.
 * Esta tabla almacena los registros de pagos realizados.
 */
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

(async () => {
  const db = await dbPromise;
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
})();

// Exporta la promesa de conexión para ser utilizada en los modelos
export default dbPromise;
