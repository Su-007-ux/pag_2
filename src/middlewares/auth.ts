import { Request, Response, NextFunction } from 'express';

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  console.log('Sesión actual:', req.session);
  if (req.session && req.session.userId && req.session.isAdmin) {
    return next();
  }
  res.redirect('/login');
}