import express from 'express';
import { requireLogin } from '../middlewares/auth';

const router = express.Router();

router.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { user: req.session.userId });
});

export default router;