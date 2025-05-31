import dbPromise from '../database/db';

/**
 * Modelo para gestionar operaciones sobre la tabla 'payments'.
 */
export default class PaymentModel {
  /**
   * Agrega un nuevo registro de pago a la base de datos.
   * 
   * @param paymentData Objeto con los datos del pago a guardar. Debe incluir:
   *  - email: correo electrónico del pagador
   *  - cardName: nombre del titular de la tarjeta
   *  - cardNumber: número de la tarjeta
   *  - expMonth: mes de expiración de la tarjeta
   *  - expYear: año de expiración de la tarjeta
   *  - cvv: código de seguridad de la tarjeta
   *  - amount: monto pagado
   *  - currency: moneda del pago
   *  - service: servicio asociado al pago
   *  - ip: dirección IP desde la que se realizó el pago
   *  - date: fecha y hora del pago
   */
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
