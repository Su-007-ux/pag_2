import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import contactRoutes from './routes/contactRoutes';
import paymentRoutes from './routes/paymentRoutes';
import ContactsController from './controllers/ContactsController';

/**
 * Archivo principal del servidor Express.
 * Configura middlewares, rutas y motor de vistas para la aplicación.
 */

const app = express();

// Middleware para parsear datos de formularios (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Rutas para el manejo de contactos
app.use('/', contactRoutes);

// Ruta para mostrar la administración de contactos
app.get('/admin', ContactsController.showContacts);

// Rutas para el manejo de pagos
app.use(paymentRoutes);

// Middleware para parsear datos de formularios (body-parser, redundante con express.urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');

// Directorio de vistas (puede sobrescribirse, solo el último tiene efecto)
app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, '../src/views'));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Redirección para la ruta /admin (puede causar conflicto con la anterior)
app.get("/admin", (req, res) => {
  res.redirect("/admin/contacts");
});

// Ruta principal: renderiza la vista 'index'
app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
