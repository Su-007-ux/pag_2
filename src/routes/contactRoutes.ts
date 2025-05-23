import { Router } from 'express';
import ContactsController from '../controllers/ContactsController';

const router = Router();

router.post('/contact/add', ContactsController.add);
router.get('/admin/contacts', ContactsController.index);

export default router;