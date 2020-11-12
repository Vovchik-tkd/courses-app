const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
const PORT = process.env.PORT || 3000; 
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true }))

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});