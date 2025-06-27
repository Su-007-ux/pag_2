import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const localesDir = path.join(__dirname, '../locales');
const availableLangs = ['en', 'es'];

function loadLocale(lang: string) {
  const file = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  }
  return {};
}

export function i18nMiddleware(req: Request, res: Response, next: NextFunction) {
  // Obtiene el idioma de cookie, sesión o por defecto 'es'
  let lang = (req.cookies && req.cookies.lang) ||
             (req.session && req.session.lang) ||
             'es';

  // Permitir cambiar idioma por query (?lang=xx)
  if (req.query.lang && typeof req.query.lang === 'string' && availableLangs.includes(req.query.lang)) {
    lang = req.query.lang;
    res.cookie('lang', lang, { maxAge: 365 * 24 * 60 * 60 * 1000 });
    if (req.session) req.session.lang = lang;
  }

  if (!availableLangs.includes(lang)) lang = 'es';

  const translations = loadLocale(lang);

  // Helper de traducción
  res.locals.t = (key: string, vars?: Record<string, string | number>) => {
    let text = translations[key] || key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  // Helper de formateo de fecha
  res.locals.formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (lang === 'en') {
      return date.toLocaleString('en-US', { hour12: true });
    } else {
      return date.toLocaleString('es-VE', { hour12: false });
    }
  };

  // Helper de formateo de moneda
  res.locals.formatCurrency = (amount: number, currency: string) => {
    if (lang === 'en') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency === 'BS' ? 'VES' : currency }).format(amount);
    } else {
      // Venezuela: VES 1.500,00 Bs
      if (currency === 'BS' || currency === 'VES') {
        return `VES ${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs`;
      }
      return new Intl.NumberFormat('es-VE', { style: 'currency', currency }).format(amount);
    }
  };

  res.locals.lang = lang;
  next();
}