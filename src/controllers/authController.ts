import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dbPromise from '../database/db';

async function authenticateUser(username: string, password: string) {
  // Simulación: usuario válido si username === "admin" y password === "1234"
  if (username === 'admin' && password === '1234') {
    return { id: 1, username: 'admin', isAdmin: true };
  }
  return null;
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
    const user = await authenticateUser(username, password);

    if (user) {
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
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
