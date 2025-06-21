import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dbPromise from '../database/db';

// Extiende la sesión para incluir los campos personalizados
declare module 'express-session' {
  interface SessionData {
    userId: number | string;
    isAdmin?: boolean;
    loginSuccess?: boolean;
  }
}

export const showLogin = (req: Request, res: Response) => {
  res.render('login');
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('login', { error: 'Todos los campos son obligatorios' });
  }
  try {
    // Caso admin hardcodeado
    if (username === 'admin' && password === '1234') {
      req.session.userId = 'admin';
      req.session.isAdmin = true;
      return res.redirect('/dashboard');
    }

    // Caso usuario registrado
    const database = await dbPromise;
    const user = await database.get('SELECT * FROM users WHERE username = ?', [username]);
    if (user && await bcrypt.compare(password, user.password_hash)) {
      req.session.userId = user.id;
      req.session.isAdmin = false;
      req.session.loginSuccess = true;
      return res.redirect('/');
    } else {
      return res.render('login', { error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    return res.render('login', { error: 'Error en el servidor' });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/login');
  });
};

export const showRegister = (req: Request, res: Response) => {
  res.render('register');
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('register', { error: 'Todos los campos son obligatorios' });
  }
  try {
    const database = await dbPromise;
    const existingUser = await database.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.render('register', { error: 'El usuario ya existe' });
    }
    const hash = await bcrypt.hash(password, 10);
    await database.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: 'El usuario ya existe o hubo un error' });
  }
};
