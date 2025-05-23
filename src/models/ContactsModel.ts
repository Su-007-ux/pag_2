import db from '../database/db';

interface Contact {
  id?: number;
  name: string;
  email: string;
  message: string;
  ip: string;
  date: string;
}

export default class ContactsModel {
  static async add(contact: Contact): Promise<void> {
    const { name, email, message, ip, date } = contact;
    const database = await db;

    await database.run(
      `INSERT INTO contacts (name, email, message, ip, date) VALUES (?, ?, ?, ?, ?)`,
      [name, email, message, ip, date]
    );
  }

  static async getAll(): Promise<Contact[]> {
    const database = await db;

    const contacts = await database.all<Contact[]>(
      `SELECT * FROM contacts ORDER BY id DESC`
    );

    return contacts;
  }
}
