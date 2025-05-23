"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
class ContactsModel {
    static async add(contact) {
        const { name, email, message, ip, date } = contact;
        const database = await db_1.default;
        await database.run(`INSERT INTO contacts (name, email, message, ip, date) VALUES (?, ?, ?, ?, ?)`, [name, email, message, ip, date]);
    }
    static async getAll() {
        const database = await db_1.default;
        const contacts = await database.all(`SELECT * FROM contacts ORDER BY id DESC`);
        return contacts;
    }
}
exports.default = ContactsModel;
