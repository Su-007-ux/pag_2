import { Request, Response } from 'express';
import axios from 'axios';
import PaymentModel from '../models/PaymentModel';

export default class PaymentController {
  static async add(req: Request, res: Response) {
    try {
      console.log('Datos recibidos en el pago:', req.body);

      // Validacion de datos básicos
      const {
        email, cardName, cardNumber, expMonth, expYear,
        cvv, amount, currency, service
      } = req.body;

      if (!email || !cardName || !cardNumber || !expMonth || !expYear || !cvv || !amount || !currency || !service) {
        return res.render('index', {
          paymentError: 'Faltan datos obligatorios.'
        });
      }

      // Obtenecion de IP
      const ipRaw = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
      const ip = Array.isArray(ipRaw) ? ipRaw[0] : (ipRaw as string);
      const date = new Date().toISOString();

      // se prepara el paymentpayload
      const paymentPayload = {
        "amount": parseFloat(amount),
        "card-number": parseInt(cardNumber),
        "cvv": parseInt(cvv),
        "expiration-month": expMonth,
        "expiration-year": expYear,
        "full-name": cardName,
        "currency": currency,
        "description": "pago de servicio",
        "reference": service,
      };

      console.log('Enviando petición a la API de pagos...');
      const paymentToken = process.env.PAYMENT_API_TOKEN;
      if (!paymentToken) {
        console.error('PAYMENT_API_TOKEN no está definido.');
        return res.render('index', {
          paymentError: 'Configuración del servidor incompleta.'
        });
      }

      const apiResponse = await axios.post(
        'https://fakepayment.onrender.com',
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${paymentToken}`
          }
        }
      );

      console.log('Respuesta de la API:', apiResponse.data);

      if (apiResponse.data && apiResponse.data.success) {
        // Guardar el pago en la base de datos
        await PaymentModel.add({
          email,
          cardName,
          cardNumber,
          expMonth,
          expYear,
          cvv,
          amount,
          currency,
          service,
          ip,
          date
        });

        console.log('Pago guardado en la base de datos.');

        return res.render('index', { paymentSuccess: true });
      } else {
        return res.render('index', {
          paymentError: 'Pago rechazado por la pasarela.'
        });
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      return res.render('index', {
        paymentError: 'Error al procesar el pago. Intenta más tarde.'
      });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const db = await require('../database/db').default;
      const payments = await db.all('SELECT * FROM payments ORDER BY date DESC');
      res.render('payments', { payments });
    } catch (err) {
      res.status(500).send('Error al obtener pagos');
    }
  }
}
