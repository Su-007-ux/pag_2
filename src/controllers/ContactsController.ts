import { Request, Response } from 'express';
import ContactsModel from '../models/ContactsModel';
import axios from 'axios';
import { sendContactEmail } from '../utils/mailer';

// Verifica el token de reCAPTCHA v3 para determinar si el usuario es humano.

async function verifyCaptcha(token: string, ip: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET;
  const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret,
      response: token,
      remoteip: ip,
    },
  });

  const data = response.data;
  return data.success && data.score >= 0.5;
}

export default class ContactsController {
  
  static async addContact(req: Request, res: Response): Promise<void> {
    const { name, email, message } = req.body;
    const token = req.body['g-recaptcha-response'];
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
    const date = new Date().toISOString();
    let country = 'Desconocido';

    let isHuman = false;
    try {
      // 1. Verificar reCAPTCHA
      isHuman = await verifyCaptcha(token, ip);
    } catch (err) {
      console.error('Error al verificar reCAPTCHA:', err);
      res.status(500).send('Error de verificación de reCAPTCHA.');
      return;
    }

    if (!isHuman) {
      // Si reCAPTCHA falla, rechaza la solicitud
      res.status(400).send('reCAPTCHA falló. Intenta nuevamente.');
      return;
    }

    try {
      // 2. Obtener país usando ipstack
      const accessKey = process.env.IPSTACK_API_KEY;
      const ipForQuery = ip.includes(',') ? ip.split(',')[0].trim() : ip;
      const response = await axios.get(`http://api.ipstack.com/${ipForQuery}?access_key=${accessKey}`);
      country = response.data?.country_name || 'Desconocido';
    } catch (error) {
      console.warn('No se pudo obtener el país con ipstack:', error);
    }

    try {
      // 3. Guardar contacto en la base de datos
      await ContactsModel.add({ name, email, message, ip, date, country });
      // 4. Enviar correo de notificación
      await sendContactEmail({ name, email, message, ip, date, country });
      res.redirect('/');
    } catch (error) {
      console.error('Error al guardar contacto:', error);
      res.status(500).send('Error al procesar el formulario.');
    }
  }

  // Renderiza la vista de administración con la lista de contactos.
  
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