// пакеты приложения
const express = require('express');
const app = express();
const { Pool , Client } = require('pg');
const pool = new Pool();
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

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

//главная страница
app.get('/', (req, res) => {
        const query = 'select name, description, image_url, price from product.goods where category_id = 2 order by sold_times desc limit 5;'
        const values = [req.params.id]

        connect.queryDB(query, [], function (result) {
            res.render('category',
            {
            title: "Главная Страница",
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0
            });
        });
        res.statusCode = 200;
    });

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'you secret key'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

//авторизация
passport.use(new localStrategy({
    usernameField: null,
    passwordField: null
},
    connect.authCheck
));
//авторизация
app.get('/login', (req,res) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'text/html; charset=utf-8');
     res.end(fs.readFileSync("./login.html"))
});
//авторизация
app.post('/login',
    passport.authenticate('local', {
    successRedirect: '/home',
    successFlash : "Welcome!",
    //failureRedirect: ,// todo сейчас специальная страница для логина
                                          //после неудачи, потому что у меня не работают flash сообщения. Починить
    failureFlash: false}),

);
//лог-аут
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.use('/admin', cfg.checkAdmin());
app.get('/admin', (req,res) => {
        res.render('index', {
            title: "Страница админа"
            })
        res.statusCode = 200;
        });


//домашняя страница
//app.use('/home', cfg.checkAuth());
app.get('/home',(req,res) => {
        res.render('index', {
            title: "Домашняя страница",
            isIndex: true
            })
        res.statusCode = 200;
    })
//страница аналитики
app.get('/analitycs', (req,res) => {
        res.render('index', {
            title: "Домашняя страница"
            })
        res.statusCode = 200;

    })
//запрос в базу
app.get('/catalog/', (req, res) => {
        const query = 'SELECT name,image_url FROM shop.product.categories;';


        connect.queryDB(query, [], function (result) {
            res.render('layouts/catalog.hbs',
            {
            title: "Каталог товаров",
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0
            });
        });
        res.statusCode = 200;
    });


app.get('/catalog/:id',async (request, response) => {
        const query = 'SELECT *  FROM shop.product.categories WHERE id=$1;';
        const values = [request.params.id]

        connect.queryDB(query, values, function (result) {
            response.render('layouts/catalog.hbs',
            {
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0
            });
        });
        res.statusCode = 200;
    });



app.get('/order',  async (request, response) => {
        const query = 'SELECT * FROM shop.product.orders;'


        connect.queryDB(query,[], function (result) {
             response.render('layouts/catalog.hbs',
             {
             'rows' : result.rows,
             'resultNotEmpty': result.rows.length !== 0
             });
        });
        res.statusCode = 200;
})


app.listen(port,host, function(){
    console.log(`Сервер запустился по адресу://${host}:${port}`)
});
