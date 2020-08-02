// КОМАНДЫ за запуск с коннектом к базе
// PGUSER=postgres PGHOST=ec2-34-229-98-104.compute-1.amazonaws.com PGPASSWORD=wMkMmC4WydSeJLJKHj96Yqp6 PGDATABASE=shop PGPORT=5432 npm start
// PGUSER=admin PGPASSWORD=12345 PGDATABASE=shop npm start


// пакеты приложения
const express = require('express');
const app = express();
const { Pool , Client } = require('pg');
const pool = new Pool();
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require("fs");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const host = '127.0.0.1';
const port = 3000;
const cfg = require('./config/cfg');
const connect = require('./config/connect');
const logger = require ('./config/logger').logger;


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(new localStrategy((user, password, done) => {connect.authCheck(user, password, done)}))

require('./routes/admin')(app);
require('./routes/upload')(app);
require('./routes/catalog')(app);
require('./routes/register')(app);
require('./routes/goods')(app);
require('./routes/users')(app);
require('./routes/book_good')(app);
require('./routes/login')(app);
require('./routes/analitycs')(app);
require('./routes/order')(app);
require('./routes/cart')(app);
require('./routes/home')(app);
require('./routes/not_found')(app);
require('./routes/delete_good')(app);



app.listen(port,host, function(){
    console.log(`Сервер запустился по адресу://${host}:${port}`)
});