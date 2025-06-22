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

router.post('/login', authController.showLogin);
router.get('/logout', authController.logout);

router.get('/register', authController.showRegister);
router.post('/register', authController.register);

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    req.session.loginSuccess = true;
    res.redirect('/');
  }
);

export default router;