"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentModel_1 = __importDefault(require("../models/PaymentModel"));
class PaymentController {
    static async add(req, res) {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const date = new Date().toISOString();
            await PaymentModel_1.default.add({
                ...req.body,
                ip,
                date
            });
            res.render('index', { paymentSuccess: true });
        }
        catch (err) {
            console.error('Error al guardar el pago:', err);
            res.status(500).send('Error al guardar el pago');
        }
    }
}
exports.default = PaymentController;
