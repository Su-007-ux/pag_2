import { Request, Response } from 'express';
import ContactsModel from '../models/ContactsModel';
import axios from 'axios';

export default class ContactsController {

  static async addContact(req: Request, res: Response): Promise<void> {
    const { name, email, message } = req.body;
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
    const date = new Date().toISOString();
    let country = 'Desconocido';

    try {
      // Obtener país desde ipapi (puedes cambiar a ipstack si prefieres)
      const response = await axios.get(`https://ipapi.co/${ip}/country_name/`);
      country = response.data || 'Desconocido';
    } catch (error) {
      console.warn('No se pudo obtener el país desde IP:', ip);
    }

    try {
      await ContactsModel.add({ name, email, message, ip, date, country });
      res.redirect('/');
    } catch (error) {
      console.error('Error al guardar contacto:', error);
      res.status(500).send('Error al procesar el formulario.');
    }
  }

  static async showContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await ContactsModel.getAll();
      res.render('admin', { contacts });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).send('Error retrieving contacts');
    }
  }
}

