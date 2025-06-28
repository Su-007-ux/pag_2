import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dbPromise from '../database/db';

async function authenticateUser(username: string, password: string) {
  // Admin hardcodeado
  if (username === 'admin' && password === '1234') {
    return { id: 1, username: 'admin', isAdmin: true };
  }

  // Buscar usuario en la base de datos
  const db = await dbPromise;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (user && user.password_hash) {
    const match = await bcrypt.compare(password, user.password_hash);
    if (match) {
      return { id: user.id, username: user.username, isAdmin: false };
    }
  }
  return null;
}

export const showLogin = (req: Request, res: Response) => {
  res.render('login');
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await authenticateUser(username, password);

  if (user) {
    req.session.userId = user.id;
    req.session.isAdmin = user.isAdmin;
    req.session.loginSuccess = true;
    req.session.save(() => {
      if (user.isAdmin) {
        return res.redirect('/dashboard');
      } else {
        return res.redirect('/');
      }
    });
  } else {
    res.render('login', { error: 'Credenciales incorrectas' });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/login'); // Redirige al login después de cerrar sesión
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

export const getProfile = (req: Request, res: Response) => {
  if (req.session.userId) {
    res.status(200).json({
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
    });
  } else {
    res.status(401).json({ message: 'No autenticado' });
  }
};
