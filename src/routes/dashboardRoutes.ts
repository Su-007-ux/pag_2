import { Router } from 'express';
import { requireLogin } from '../middlewares/auth';

const router = Router();

router.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard');
});

export default router;