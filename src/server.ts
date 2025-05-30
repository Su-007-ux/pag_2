import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import contactRoutes from './routes/contactRoutes';
import paymentRoutes from './routes/paymentRoutes';
import ContactsController from './controllers/ContactsController';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use('/', contactRoutes);

app.get('/admin', ContactsController.showContacts);

app.use(paymentRoutes);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.set('views', path.join(__dirname, '../src/views'));

app.use(express.static(path.join(__dirname, '../public')));

app.get("/admin", (req, res) => {
  res.redirect("/admin/contacts");
});

app.get('/', (req: Request, res: Response) => {
  res.render('index');
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
}   );
