import express, { Request, Response } from 'express';
import session from 'express-session';
import path from 'path';
import contactRoutes from './routes/contactRoutes';
import paymentRoutes from './routes/paymentRoutes';
import ContactsController from './controllers/ContactsController';
import connectSqlite3 from 'connect-sqlite3';
import authRoutes from './routes/authRoutes';
import passport from './auth/passport';
import dashboardRoutes from './routes/dashboardRoutes';



/**
 * Archivo principal del servidor Express.
 * Configura middlewares, rutas y motor de vistas para la aplicación.
 */

const app = express();

// Middleware para parsear datos de formularios (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión (debe ir antes de las rutas que la usan)
const SQLiteStore = connectSqlite3(session);
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite' }) as unknown as session.Store,
  secret: process.env.SESSION_SECRET || 'secreto_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000 // 15 minutos
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rutas para el manejo de contactos
app.use('/', contactRoutes);

// Ruta para mostrar la administración de contactos
app.get('/admin', ContactsController.showContacts);

// Rutas para el manejo de pagos
app.use(paymentRoutes);

// Rutas de autenticación
app.use('/', authRoutes);

// Rutas del panel de control
app.use('/', dashboardRoutes);

// Ruta principal: renderiza la vista 'index' con metadatos OG
app.get('/', (req: Request, res: Response) => {
  const loginSuccess = req.session?.loginSuccess;
  if (loginSuccess) delete req.session.loginSuccess;
  res.render('index', {
    ogTitle: 'Página Principal',
    ogDescription: 'Bienvenido a la página principal de mi sitio. Completa el formulario de contacto.',
    ogType: 'website',
    ogUrl: 'https://tusitio.com/',
    ogImage: 'https://tusitio.com/imagen-principal.png',
    userId: req.session?.userId,
  });
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

