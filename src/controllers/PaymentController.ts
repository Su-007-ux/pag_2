import { Request, Response } from 'express';
import axios from 'axios';
import PaymentModel from '../models/PaymentModel';

export default class PaymentController {
  static async add(req: Request, res: Response) {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const date = new Date().toISOString();
      const {
        email, cardName, cardNumber, expMonth, expYear,
        cvv, amount, currency, service
      } = req.body;

      const paymentPayload = {
        cardNumber,
        expMonth,
        expYear,
        cvv,
        amount,
        currency,
      };
      
      const apiResponse = await axios.post(
        'https://fakepayment.onrender.com/pay',
        paymentPayload,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMzBUMjI6NDQ6NTAuOTcyWiIsImlhdCI6MTc0ODY0NTA5MH0.JLzcaeAvnBVhlewjTCUeMN-mTCQoPnEVXObvFKRvsfc'
          }
        }
      );

      if (apiResponse.data && apiResponse.data.success) {
        
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
