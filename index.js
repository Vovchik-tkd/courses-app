const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const User = require('./models/user')
const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
const PORT = process.env.PORT || 3000; 
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5fbf8e4ddfa4770a9b44923f');
        req.user = user;
        next();
    } catch(e) {
        console.log(`Error: ${e}`);
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true }))

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);

async function start() {
    try {
        uri = 'mongodb+srv://vovayubko:24j8YjTzcenJLhxv@cluster0.qdsy6.mongodb.net/shop?retryWrites=true&w=majority';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        .then(() => console.log('MongoDB connected'))
        .catch(e => console.log('Ooops'))
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'vova.yubko200w@gmail.com',
                name: 'Vladimir',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch(e) {
        console.log(e);
    }
}


start();