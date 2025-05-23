"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_1 = __importDefault(require("../controllers/PaymentController"));
const router = (0, express_1.Router)();
router.post('/payment/add', PaymentController_1.default.add);
router.get('/payment/success', (req, res) => {
    res.render('index', { paymentSuccess: true });
});
exports.default = router;
