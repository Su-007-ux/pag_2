import dbPromise from '../database/db';

export default class PaymentModel {
  static async add(paymentData: any) {
    const db = await dbPromise;
    const { email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency, service, ip, date } = paymentData;

    await db.run(
      `INSERT INTO payments (email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency, service, ip, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency, service, ip, date]
    );
  }
}
