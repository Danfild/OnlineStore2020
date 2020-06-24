// пакеты приложения
const express = require('express');
const app = express();
const { Pool , Client } = require('pg');
const pool = new Pool();
const fs = require("fs");
const bodyParser = require('body-parser');
const html_tablify = require('html-tablify');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const host = '127.0.0.1';
const port = 3000;

//роуты
const analitycsRoutes = require('./routes/analitycs');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');



passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'you secret key'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//роуты приложения
app.use('/analytics', analitycsRoutes);
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/order', orderRoutes);
app.use('/position', positionRoutes);

//главная страница
app.get('/', (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync("./main.html"))
})

//проверка авторизации
function checkAuth() {
     return (req, res, next) => {
       if(req.user)
         next();
       else
         res.redirect('/login');
     };
    }

//todo функция авторизации. Должна быть заменена на специальный метод, который обраается в базу и смотрит там корректны ли данные
    passport.use(new localStrategy((user, password, done) => {
     if(user !== 'a') //todo заменить на функцию, которая идет в базу и смотрит есть ли такой юзера
       return done(null, false, {message: 'User not found'});
     else if(password !== 'a') //todo заменить на функцию, котроая идет в базу и проверяет правильный ли пароль для этого юзера
       return done(null, false, {message: 'Wrong password'});

     return done(null, {id: 1, name: user, password}); //todo изменить набор возвращаемых значений (см. что есть в базе)
    }));

//коннект к базе
function queryDB(query, params, resultHandler) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Cannot connect to the DB" + err);
        }
        client.query(query, params, function (err, result) {
            done();
            if (err) {
                console.log(err);
            }
            resultHandler(result)
        })
    })
}

//конвертер json в html строку для отображения на сайте
    function jsonToHTMLTable(data) {
        var table = html_tablify.tablify ({
            data: data
        })
    return `<!DOCTYPE html>
<html>
<body>
<h1>Products</h1>`
        + table +
        `</body>
</html>
`
}

app.get('/', (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync("./index_page.html"));
})

app.get('/login', (req,res) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'text/html; charset=utf-8');
     res.end(fs.readFileSync("./login.html"))
});

app.post('/login',
    passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/loginAfterFailure', // todo сейчас специальная страница для логина
                                          //после неудачи, потому что у меня не работают flash сообщения. Починить
    failureFlash: true })
);

    //todo временный костыль
app.get('/loginAfterFailure', (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync("./login-after-failure.html"))
    });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/home', checkAuth());
app.get('/home', (req,res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync("./home.html"));
    })

    //todo написать кнопку logout. Сейчас надо перезагружаться:)))
   //запрос в базу
app.get('/products', async (request, response) => {
    const query = 'SELECT * FROM shop.product.goods;'

    queryDB(query, [], function (result) {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(jsonToHTMLTable(result.rows))
    })
})
// запрос из базы по id
app.get('/products/:id', async (request, response) => {
    const query = 'SELECT * FROM shop.product.goods WHERE id=$1'
    const values = [request.params.id]

    queryDB(query, values, function (result) {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(jsonToHTMLTable(result.rows))

    })
})

app.listen(port,host, function(){
    console.log(`Сервер запустился по адресу://${host}:${port}`)
});
