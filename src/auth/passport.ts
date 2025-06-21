import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dbPromise from '../database/db';

// Definir el callback dinámicamente según entorno
const callbackURL =
  process.env.NODE_ENV === 'production'
    ? 'https://pag-god.onrender.com/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback';

// Validar variables de entorno
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en las variables de entorno');
}

// Registrar estrategia de Google
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const database = await dbPromise;
      const email = profile.emails?.[0]?.value || '';
      let user = await database.get('SELECT * FROM users WHERE username = ?', [email]);

      // Si no existe, lo crea sin contraseña
      if (!user) {
        await database.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [email, '']);
        user = await database.get('SELECT * FROM users WHERE username = ?', [email]);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serializar usuario a sesión
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserializar desde sesión
passport.deserializeUser(async (id: number, done) => {
  try {
    const database = await dbPromise;
    const user = await database.get('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
