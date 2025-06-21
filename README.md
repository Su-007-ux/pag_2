# Service Tecno - Proyecto Express + TypeScript

Este proyecto es una aplicación web para la gestión de servicios técnicos, pagos y contactos, desarrollada con **Node.js**, **Express**, **TypeScript**, **EJS**, **SQLite** y varias integraciones externas.

---

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración de variables de entorno](#configuración-de-variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Servicios integrados](#servicios-integrados)
  - [Base de datos SQLite](#base-de-datos-sqlite)
  - [Google reCAPTCHA v3](#google-recaptcha-v3)
  - [API de geolocalización ipstack](#api-de-geolocalización-ipstack)
  - [Correo electrónico (Nodemailer)](#correo-electrónico-nodemailer)
  - [Pasarela de pagos (Fake Payment API)](#pasarela-de-pagos-fake-payment-api)
  - [Google Analytics](#google-analytics)
  - [Protocolo Open Graph (OG)](#protocolo-open-graph-og)
  - [Gestión segura de sesiones](#gestión-segura-de-sesiones)
- [Ejecución del proyecto](#ejecución-del-proyecto)
- [Despliegue en Render](#despliegue-en-render)
- [Notas de seguridad](#notas-de-seguridad)

---

## Requisitos

- Node.js >= 18.x
- npm >= 9.x
- (Opcional) Cuenta en [Render.com](https://render.com/) para despliegue
- Claves de API para reCAPTCHA, ipstack y correo electrónico

---

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/servicetecno.git
   cd servicetecno
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

---

## Configuración de variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido y tus propias claves:

```env
# Google reCAPTCHA v3
RECAPTCHA_SECRET=TU_CLAVE_SECRETA_RECAPTCHA

# API de geolocalización ipstack
IPSTACK_API_KEY=TU_API_KEY_IPSTACK

# Configuración de correo (Nodemailer)
EMAIL_HOST=smtp.tuservidor.com
EMAIL_PORT=587
EMAIL_USER=tuusuario@tucorreo.com
EMAIL_PASS=tu_contraseña
EMAIL_TO=destino@tucorreo.com

# Token para la API de pagos
PAYMENT_API_TOKEN=TU_TOKEN_FAKEPAYMENT

# Clave de sesión segura
SESSION_SECRET=TU_SESION_SECRETA

# Google OAuth (si usas autenticación con Google)
GOOGLE_CLIENT_ID=TU_CLIENT_ID
GOOGLE_CLIENT_SECRET=TU_CLIENT_SECRET
```

---

## Estructura del proyecto

```
src/
  controllers/
    ContactsController.ts
    PaymentController.ts
    authController.ts
  database/
    db.ts
  models/
    ContactsModel.ts
    PaymentModel.ts
  routes/
    contactRoutes.ts
    paymentRoutes.ts
    authRoutes.ts
    dashboardRoutes.ts
    index.ts
  utils/
    mailer.ts
  views/
    index.ejs
    admin.ejs
    dashboard.ejs
    layout.ejs
    login.ejs
    payments.ejs
    register.ejs
  middlewares/
    auth.ts
  auth/
    passport.ts
  apps.ts
  server.ts
.env
sqlite.db
```

---

## Servicios integrados

### Base de datos SQLite

- El archivo `src/database/db.ts` configura la base de datos SQLite y crea las tablas `contacts`, `payments` y `users` si no existen.
- La base de datos se almacena en la raíz del proyecto como `sqlite.db`.
- Los modelos (`ContactsModel.ts`, `PaymentModel.ts`) gestionan las operaciones CRUD.

### Google reCAPTCHA v3

- Protege el formulario de contacto contra bots.
- El frontend (`index.ejs`) integra el script de reCAPTCHA y añade el token al formulario antes de enviarlo.
- El backend (`ContactsController.ts`) valida el token usando la clave secreta.

### API de geolocalización ipstack

- Se utiliza para obtener el país del usuario a partir de su IP al enviar un contacto.
- El controlador de contactos (`ContactsController.ts`) consulta la API usando la clave configurada.

### Correo electrónico (Nodemailer)

- El archivo `src/utils/mailer.ts` configura un transporte SMTP usando las variables de entorno.
- Cuando se recibe un nuevo contacto, se envía una notificación por correo electrónico con los datos recibidos.

### Pasarela de pagos (Fake Payment API)

- El formulario de pago envía los datos a `/payment/add`.
- El backend (`PaymentController.ts`) envía los datos a la API externa de pagos usando el token configurado.
- Si el pago es exitoso, se almacena en la base de datos y se muestra un mensaje de éxito.

### Google Analytics

- El script de Google Analytics está incluido en las vistas (`index.ejs`, `admin.ejs`).
- Se envían eventos personalizados al enviar los formularios de contacto y pago.

### Protocolo Open Graph (OG)

- El layout principal (`views/layout.ejs`) incluye etiquetas OG dinámicas para mejorar la visualización de la web al compartir en redes sociales.
- Los metadatos OG (`ogTitle`, `ogDescription`, `ogType`, `ogUrl`, `ogImage`) se pasan desde el backend al renderizar cada vista.
- Ejemplo de uso en el layout:
  ```html
  <meta property="og:title" content="<%= ogTitle || 'Mi Sitio' %>">
  <meta property="og:description" content="<%= ogDescription || 'Descripción por defecto' %>">
  <meta property="og:type" content="<%= ogType || 'website' %>">
  <meta property="og:url" content="<%= ogUrl || 'https://tusitio.com' %>">
  <meta property="og:image" content="<%= ogImage || 'https://tusitio.com/imagen.png' %>">
  ```

### Gestión segura de sesiones

- Las sesiones se gestionan con `express-session` y `connect-sqlite3`.
- Las cookies de sesión están configuradas con:
  - `httpOnly: true` (no accesible por JavaScript)
  - `sameSite: 'lax'` (protección CSRF)
  - `secure: true` solo en producción (requiere HTTPS)
  - `maxAge: 15 * 60 * 1000` (expiran tras 15 minutos de inactividad)
- Ejemplo de configuración en `server.ts`:
  ```typescript
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
  ```

---

## Ejecución del proyecto

1. Compila el proyecto TypeScript (si es necesario):

   ```bash
   npx tsc
   ```

2. Inicia el servidor:

   ```bash
   npm start
   ```

3. Accede a la aplicación en [http://localhost:3000](http://localhost:3000)

---

## Despliegue en Render

- Render detecta automáticamente el archivo `package.json` y ejecuta `npm install` y `npm start`.
- **No subas la carpeta `node_modules` ni el archivo `package-lock.json` al repositorio.**
- Asegúrate de configurar las variables de entorno en el dashboard de Render.
- Render instalará las dependencias nativas (como `sqlite3`) en su entorno Linux.

---

## Notas de seguridad

- Usa siempre HTTPS en producción.
- Cambia las claves y contraseñas de ejemplo por las tuyas propias.
- Las cookies de sesión son seguras y expiran tras 15 minutos de inactividad.
- Revisa las políticas de privacidad y cumplimiento de PCI DSS si procesas pagos reales.

---

## Créditos

Desarrollado por Jesus Dobles.

---
