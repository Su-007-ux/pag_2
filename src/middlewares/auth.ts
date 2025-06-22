import { Request, Response, NextFunction } from 'express';

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) return next();
  res.redirect('/login');
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  console.log('Session en dashboard:', req.session);
  if (req.session && req.session.userId === 'admin' && req.session.isAdmin) {
    return next();
  }
  return res.redirect('/');
}