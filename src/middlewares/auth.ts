import { Request, Response, NextFunction } from 'express';

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) return next();
  res.redirect('/login');
}