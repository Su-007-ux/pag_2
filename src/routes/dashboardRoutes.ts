import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Middleware para proteger la ruta solo para admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  console.log('Session en dashboard:', req.session);
  if (req.session.userId === 'admin' && req.session.isAdmin) {
    return next();
  }
  return res.redirect('/');
}

router.get('/dashboard', requireAdmin, (req: Request, res: Response) => {
  res.render('dashboard');
});

export default router;