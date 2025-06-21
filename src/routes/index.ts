import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response) => {
    const loginSuccess = req.session.loginSuccess;
    if (loginSuccess) delete req.session.loginSuccess;
    res.render('index', {
        ogTitle: 'Página Principal',
        ogDescription: 'Bienvenido a la página principal de mi sitio. Completa el formulario de contacto.',
        ogType: 'website',
        ogUrl: 'https://tusitio.com/',
        ogImage: 'https://tusitio.com/imagen-principal.png',
        userId: req.session.userId,
        loginSuccess // <-- Añade esto
    });
});

export default router;