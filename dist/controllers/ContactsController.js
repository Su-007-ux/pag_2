"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ContactsModel_1 = __importDefault(require("../models/ContactsModel"));
class ContactsController {
    static async add(req, res) {
        const { name, email, message } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        const date = new Date().toISOString();
        try {
            await ContactsModel_1.default.add({
                name,
                email,
                message,
                ip: String(ip),
                date,
            });
            res.redirect('/');
        }
        catch (error) {
            console.error('Error al guardar el contacto:', error.message);
            res.status(500).send('Error al guardar el contacto.');
        }
    }
    static async index(req, res) {
        try {
            const contacts = await ContactsModel_1.default.getAll();
            res.render('admin', { contacts });
        }
        catch (error) {
            console.error('Error al obtener los contactos:', error);
            res.status(500).send('Error al obtener los contactos.');
        }
    }
}
exports.default = ContactsController;
