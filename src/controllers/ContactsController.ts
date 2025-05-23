import { Request, Response } from 'express';
import ContactsModel from '../models/ContactsModel';

export default class ContactsController {

  static async add(req: Request, res: Response) {
    const { name, email, message } = req.body;

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const date = new Date().toISOString();

    try {
      await ContactsModel.add({
        name,
        email,
        message,
        ip: String(ip),
        date,
      });

      res.redirect('/');
    } catch (error: any) {
      console.error('Error al guardar el contacto:', error.message);
      res.status(500).send('Error al guardar el contacto.');
    }
  }


  static async index(req: Request, res: Response) {
    try {
      const contacts = await ContactsModel.getAll();
      res.render('admin', { contacts });
    } catch (error) {
      console.error('Error al obtener los contactos:', error);
      res.status(500).send('Error al obtener los contactos.');
    }
  }
}

