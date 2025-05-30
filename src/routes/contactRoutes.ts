import { Router } from 'express';
import ContactsController from '../controllers/ContactsController';

const router = Router();

router.post('/contact/add', ContactsController.addContact);
router.get('/admin/contacts', ContactsController.showContacts);

export default router;