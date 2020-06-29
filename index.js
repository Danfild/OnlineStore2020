// пакеты приложения
const express = require('express');
const app = express();
const { Pool , Client } = require('pg');
const pool = new Pool();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const fs = require("fs");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const host = '127.0.0.1';
const port = 3000;
const cfg = require('./config/cfg');


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

//главная страница
app.get('/', (req, res) => {
    res.statusCode = 200;
    res.render('index', {
    title: "Главная страница",
    isIndex: true
    })
})





passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'you secret key'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

function getUser(username, done) {
    const query = 'SELECT * FROM shop.product.users WHERE username = $1::text';
    const  params = [username];
    cfg.queryDB(query, params, done)
};

passport.use(new localStrategy({
    usernameField: null,
    passwordField: null
},
function(username, password, done) {
    getUser(username, function(result) {
        if (result.rows.length == 0) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        const user = result.rows[0];
        if (user.password !== password) {
            return done(null, false, {message: 'Incorrect password.'});
        }else {
            return done(null, user);
        }
    });
}));



app.get('/login', (req,res) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'text/html; charset=utf-8');
     res.end(fs.readFileSync("./login.html"))
});

app.post('/login',
    passport.authenticate('local', {
    successRedirect: '/home',
    successFlash : "Welcome!",
    //failureRedirect: '/loginAfterFailure', // todo сейчас специальная страница для логина
                                          //после неудачи, потому что у меня не работают flash сообщения. Починить
    failureFlash: false}),

);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/home', cfg.checkAuth());
app.get('/home', (req,res) => {
        res.render('index', {
            title: "Домашняя страница",
            isIndex: true
            })
        res.statusCode = 200;
    })

app.use('/analitycs', cfg.checkAuth());
app.get('/analitycs', (req,res) => {
        res.render('index', {
            title: "Домашняя страница"
            })
        res.statusCode = 200;

    })
   //запрос в базу
app.get('/catalog/products', cfg.checkAuth(), async (request, response) => {
    const query = 'SELECT name as Название,price as Цена  FROM shop.product.goods;'

    cfg.queryDB(query, [], function (result) {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(cfg.jsonToHTMLTable(result.rows))
    })
})

// запрос из базы по id
app.get('/catalog/products/:id', async (request, response) => {
    const query = 'SELECT  name as Название,price as Цена FROM shop.product.goods WHERE id=$1'

    const values = [request.params.id]

    cfg.queryDB(query, values, function (result) {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(cfg.jsonToHTMLTable(result.rows))

    })
})

app.get('/order', cfg.checkAuth(), async (request, response) => {
    const query = 'SELECT * FROM shop.product.orders;'

    cfg.queryDB(query, [], function (result) {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(cfg.jsonToHTMLTable(result.rows))
    })
})



app.listen(port,host, function(){
    console.log(`Сервер запустился по адресу://${host}:${port}`)
});
