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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new localStrategy((user, password, done) => {connect.authCheck(user, password, done)}))

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
//страницы администратора
app.use('/admin', cfg.checkAdmin());
app.get('/admin', (req,res) => {
        res.render('index', {
            title: "Страница админа"
            })
        res.statusCode = 200;
        });

//страница аналитики
app.get('/analitycs', (req,res) => {
        res.render('index', {
            title: "Домашняя страница"
            })
        res.statusCode = 200;
    })

//главная страница
app.get('/', (req, res) => {
        const query = 'select id as goodId ,name, description, image_url, price from product.goods where category_id = 2 order by sold_times desc limit 5;'
        console.log(req.user);
        connect.queryDB(query, [], function (result) {
       var userId;
            console.log(req.user);
         if (req.user ){
         console.log(req.user.id)
               userId = req.user.id
               } else {
               userId = null
               }
            res.render('layouts/category.hbs',
            {
            title: "Главная Страница",
            'userId' :  req.user ? req.user.id : null,
           // 'userId' : true,
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0 // todo: in_stock != 0
            });
        });
        res.statusCode = 200;
    });

//страница аналитики
app.use('/users', cfg.checkAdmin());
app.get('/users', (req,res) => {
        const query = 'select email,username,last_name,phone_num from shop.product.users;'

        connect.queryDB(query, [], function (result) {
             res.render('layouts/users.hbs',
             {
             title: "Пользователи",
             'rows' : result.rows,
             'resultNotEmpty': result.rows.length !== 0
              });
        res.statusCode = 200;
    });
 });

app.use('/ewe', cfg.checkAuth());
app.get('/ewe', (req, res) => {
    console.log(req.user);
    res.send(req.user);

    res.statusCode = 200;
  });

//домашняя страница
app.use('/home', cfg.checkAuth());
app.get('/home', (req,res) => {
        res.render('index', {
            title: "Домашняя страница",
            isIndex: true
            })
        res.statusCode = 200;
    });

//запрос в базу
app.get('/catalog', (req, res) => {
        const query = 'SELECT * FROM shop.product.categories;';

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

app.get('/order',  (req,res) => {
      //  const query = 'SELECT * FROM shop.product.orders;';
        //const values = [req.params.id];
//
        //connect.queryDB(query, [], function (result) {
          res.render('layouts/orders.hbs',{
            title: "Страница заказов"
             //'rows' : result.rows,
             //'resultNotEmpty': result.rows.length !== 0

        });
        res.statusCode = 200;
});

//app.get('/order', (req, res) => {
      //  const query = 'SELECT name, description, price, image_url FROM shop.product.goods where category_id=$1;'
        //const values = [req.params.id]

        //connect.queryDB(query, values, function (result) {
           // res.render("layouts/orders.hbs",
           // {
             //'rows' : result.rows,
            // 'resultNotEmpty': result.rows.length != 0,
             //'userId': req.user.id
            //});
       //     res.statusCode = 200;
       // })
//});

//app.get('/catalog/:id',async (request, response) => {
        //const query = 'SELECT *  FROM shop.product.categories WHERE id=$1;';
        //const values = [request.params.id]

       // connect.queryDB(query, function (result) {
           // response.render('layouts/catalog.hbs',
           // {
           // 'rows' : result.rows,
           // 'resultNotEmpty': result.rows.length !== 0
           // });
        //});
        //res.statusCode = 200;
   // });

app.listen(port,host, function(){
    console.log(`Сервер запустился по адресу://${host}:${port}`)
});