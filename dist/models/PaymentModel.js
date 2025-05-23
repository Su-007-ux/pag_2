"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
class PaymentModel {
    static async add(paymentData) {
        const db = await db_1.default;
        const { email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency, service, ip, date } = paymentData;
        await db.run(`INSERT INTO payments (email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency, service, ip, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency, service, ip, date]);
    }
}
exports.default = PaymentModel;
