import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Middleware para proteger la ruta solo para admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId === 'admin') {
    console.log('Session en dashboard');
    return next();
  }
  return res.redirect('/');
}

router.get('/dashboard', requireAdmin, (req: Request, res: Response) => {
  res.render('dashboard');
});

export default router;