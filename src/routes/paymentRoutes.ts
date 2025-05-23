import { Router } from 'express';
import PaymentController from '../controllers/PaymentController';

const router = Router();

router.post('/payment/add', PaymentController.add);
router.get('/payment/success', (req, res) => {
  res.render('index', { paymentSuccess: true });
});

export default router;
