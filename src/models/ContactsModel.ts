import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Interfaz que representa un contacto almacenado en la base de datos.
 */
export interface Contact {
  name: string;
  email: string;
  message: string;
  ip: string;
  date: string;
  country: string;
}

/**
 * Abre una conexión a la base de datos SQLite.
 * @returns Promesa que resuelve con la conexión a la base de datos.
 */
async function openDb() {
  return open({
    filename: './sqlite.db',
    driver: sqlite3.Database
  });
}

/**
 * Modelo para gestionar operaciones sobre la tabla 'contacts'.
 */
export default class ContactsModel {
  /**
   * Agrega un nuevo contacto a la base de datos.
   * @param contact Objeto con los datos del contacto a guardar.
   */
  static async add(contact: Contact): Promise<void> {
    const { name, email, message, ip, date, country } = contact;
    const db = await openDb();
    await db.run(
      `INSERT INTO contacts (name, email, message, ip, date, country)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, message, ip, date, country]
    );
  }

  /**
   * Obtiene todos los contactos almacenados en la base de datos, ordenados por fecha descendente.
   * @returns Promesa que resuelve con un arreglo de contactos.
   */
  static async getAll(): Promise<Contact[]> {
    const db = await openDb();
    return db.all('SELECT * FROM contacts ORDER BY date DESC');
  }
}