import { Router } from 'express';
import ContactsController from '../controllers/ContactsController';

/**
 * Define las rutas relacionadas con el manejo de contactos.
 *
 * - POST /contact/add: Procesa el formulario de contacto y guarda el mensaje.
 * - GET /admin/contacts: Muestra la lista de contactos en la vista de administración.
 */
const router = Router();

/**
 * Ruta para agregar un nuevo contacto.
 * Llama al método 'addContact' del ContactsController.
 */
router.post('/contact/add', ContactsController.addContact);

/**
 * Ruta para mostrar la lista de contactos en la administración.
 * Llama al método 'showContacts' del ContactsController.
 */
router.get('/admin/contacts', ContactsController.showContacts);

export default router;