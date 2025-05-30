import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export interface Contact {
  name: string;
  email: string;
  message: string;
  ip: string;
  date: string;
  country: string;
}

async function openDb() {
  return open({
    filename: './sqlite.db',
    driver: sqlite3.Database
  });
}

export default class ContactsModel {
  static async add(contact: Contact): Promise<void> {
    const { name, email, message, ip, date, country } = contact;
    const db = await openDb();
    await db.run(
      `INSERT INTO contacts (name, email, message, ip, date, country)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, message, ip, date, country]
    );
  }

  static async getAll(): Promise<Contact[]> {
    const db = await openDb();
    return db.all('SELECT * FROM contacts ORDER BY date DESC');
  }
}