const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const MONGODB_URI = 'mongodb+srv://vovayubko:24j8YjTzcenJLhxv@cluster0.qdsy6.mongodb.net/shop?retryWrites=true&w=majority';
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const PORT = process.env.PORT || 3000; 
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true }))
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

async function start() {
    try {
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        .then(() => console.log('MongoDB connected'))
        .catch(e => console.log('Ooops'));

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch(e) {
        console.log(e);
    }
}


start();