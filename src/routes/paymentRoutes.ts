import { Router } from 'express';
import { requireLogin } from '../middlewares/auth';
import PaymentController from '../controllers/PaymentController';

/**
 * Define las rutas relacionadas con los pagos.
 *
 * - POST /payment/add: Procesa la solicitud de pago enviada desde el formulario.
 * - GET /payment/success: Renderiza la vista principal mostrando un mensaje de éxito en el pago.
 */
const router = Router();

/**
 * Ruta para procesar un nuevo pago.
 * Llama al método 'add' del PaymentController.
 */
router.post('/payment/add', PaymentController.add);

/**
 * Ruta para mostrar la página de éxito tras un pago exitoso.
 * Renderiza la vista 'index' con la variable 'paymentSuccess' en true.
 */
router.get('/payment/success', (req, res) => {
  res.render('index', { paymentSuccess: true });
});

router.get('/payments', requireLogin, PaymentController.list);

export default router;
