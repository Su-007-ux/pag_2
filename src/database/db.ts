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
 *
 * Campos:
 * - id: identificador único (autoincremental)
 * - name: nombre del remitente
 * - email: correo electrónico del remitente
 * - message: mensaje enviado
 * - ip: dirección IP desde la que se envió el mensaje
 * - date: fecha y hora del envío
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
 *
 * Campos:
 * - id: identificador único (autoincremental)
 * - email: correo electrónico del pagador
 * - cardName: nombre del titular de la tarjeta
 * - cardNumber: número de la tarjeta
 * - expMonth: mes de expiración de la tarjeta
 * - expYear: año de expiración de la tarjeta
 * - cvv: código de seguridad de la tarjeta
 * - amount: monto pagado
 * - currency: moneda del pago
 * - service: servicio asociado al pago
 * - ip: dirección IP desde la que se realizó el pago
 * - date: fecha y hora del pago
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

// Exporta la promesa de conexión para ser utilizada en los modelos
export default dbPromise;
