import { Request, Response } from 'express';
import PaymentModel from '../models/PaymentModel';

export default class PaymentController {
  static async add(req: Request, res: Response) {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const date = new Date().toISOString();

      await PaymentModel.add({
        ...req.body,
        ip,
        date
      });

      res.render('index', { paymentSuccess: true });
    } catch (err) {
      console.error('Error al guardar el pago:', err);
      res.status(500).send('Error al guardar el pago');
    }
  }
}
