import express from 'express';
import { requireAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/dashboard', requireAdmin, (req, res) => {
  res.render('dashboard', { user: req.session.userId });
});

export default router;