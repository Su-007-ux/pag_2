import { Request, Response } from 'express';
import axios from 'axios';
import PaymentModel from '../models/PaymentModel';

export default class PaymentController {
  static async add(req: Request, res: Response) {
    try {
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
        cardNumber,
        expMonth,
        expYear,
        cvv,
        amount,
        currency,
      };

      const paymentToken = process.env.PAYMENT_API_TOKEN;
      if (!paymentToken) {
        console.error('PAYMENT_API_TOKEN no está definido.');
        return res.render('index', {
          paymentError: 'Configuración del servidor incompleta.'
        });
      }

      const apiResponse = await axios.post(
        'https://fakepayment.onrender.com/pay',
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${paymentToken}`
          }
        }
      );

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
}
