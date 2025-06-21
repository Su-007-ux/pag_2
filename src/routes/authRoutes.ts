import { Router } from 'express';
import * as authController from '../controllers/authController';
import { requireLogin } from '../middlewares/auth';
import passport from '../auth/passport';

const router = Router();

router.get('/login', (req, res) => {
  res.render('login', {
    ogTitle: 'Iniciar sesión',
    ogDescription: 'Accede a tu cuenta.'
  });
});

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/register', authController.showRegister);
router.post('/register', authController.register);

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/contacts'
  })
);

export default router;