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

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

//app.use(express.cookieParser('keyboard cat'));
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
app.get('/login', (request,response) => {

     response.render('./partials/login.hbs', {
                 title: "Страница админа"
                 })
             response.statusCode = 200;
             });
    // res.setHeader('Content-Type', 'text/html; charset=utf-8');
    //res.end(fs.readFileSync("./login.html"))
//});

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
app.get('/logout', function(request, response){
  request.logout();
  response.redirect('/login');
});


app.use('/admin/create_items', cfg.checkAdmin());
app.get('/admin/create_items', (request,response) => {
            var adminId;
            var userId;
               if (request.user ){
               userId = request.user.id
               adminId= request.user.is_admin
               } else {
               userId = null
               adminId = null
                }
    response.render('index', {
        title: 'Добавление товара',
        'adminId': adminId
    })
    response.statusCode = 200;
});

//страница аналитики
app.use('/analitycs', cfg.checkAdmin());
app.get('/analitycs', (request,response) => {
            var adminId;
            if (request.user){
             adminId = request.user.is_admin
            } else {
             adminId = null
            }
        response.render('index', {
            title: "Домашняя страница",
            'adminId': adminId,
            })
        response.statusCode = 200;
    })

//страницы администратора
app.use('/admin', cfg.checkAdmin());
app.get('/admin', (request,response) => {
         var adminId;
         if (request.user){
             adminId = request.user.is_admin
             } else {
             adminId = null
             }
             response.render('index',
             {
             title: "Страница админа",
             'adminId': adminId,
             });
        response.statusCode = 200;
        });


//главная страница
app.get('/', (request,response) => {
         const query = `select MAX(shop.product.goods.id) as good_id, MAX(shop.product.goods.name) as name,
         MAX(shop.product.goods.description) as description,
         MAX(shop.product.goods.image_url) as image_url,
         MAX(shop.product.goods.price) as price,
         count(shop.product.items.id) as in_stock from shop.product.goods
         join shop.product.items on goods.id = items.good_id where items.is_sold = false
         and items.booked_by_user is null group by goods.id order by description, in_stock limit 5;`
        connect.queryDB(query, [], function (result) {
        var adminId;
        var userId;
         if (request.user ){
               userId = request.user.id
               adminId= request.user.is_admin
               } else {
               userId = null
               adminId = null
               }
            response.render('layouts/category.hbs',
            {
            title: "Главная Страница",
            'userId' :  request.user ? request.user.id : null,
            'adminId': adminId,
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0
            });
            //console.log(result.rows)

        });
        response.statusCode = 200;
    });
app.use('/orders', cfg.checkAdmin());
app.get('/orders', (request,response) => {
        const query = 'select max(shop.product.users.username) as name, max(shop.product.users.last_name) as lastName, max(shop.product.users.phone_num) as phone, max(shop.product.orders.address) as adress, sum(shop.product.goods.price) as price from shop.product.items  join shop.product.goods on items.good_id = goods.id join shop.product.users on shop.product.items.booked_by_user = shop.product.users.id join shop.product.orders on shop.product.users.id = shop.product.orders.user_id;';
        var adminId;
        if (request.user){
           adminId = request.user.is_admin
        } else {
           adminId = null
        }
        connect.queryDB(query, [], function (result) {
        response.render('./layouts/orders.hbs', {
              title: "Корзина",
              'rows' : result.rows,
              'adminId': adminId,
              'resultNotEmpty': result.rows.length !== 0
              })
              response.statusCode = 200;
              });
    });

//запрос
app.post('/book_good',  (request,response) => {
      //const query = 'select MAX(shop.product.goods.id) as goodId,MAX(shop.product.goods.name) as name,MAX(shop.product.goods.description) as description,MAX(shop.product.goods.image_url) as image_url,MAX(shop.product.goods.price) as price, count(shop.product.items.id) as in_stock from shop.product.goods join shop.product.items on goods.id = items.good_id where goods.category_id = 1;'
      const query = "update shop.product.items set booked_by_user = $1  where id = (select id from product.items where good_id = $2 and booked_by_user is null and is_sold = false limit 1)";
      // const query = 'insert into product.items (good_id,booked_by_user) values (`goodId`,`userId`)';
      const values = [request.body.userId , request.body.goodId];
      const category_id = request.body.category_id;
      const good_name = request.body.name;
      console.log(request.body)
      connect.queryDB(query, values, function (result) {
           // return response.send();
          request.flash('info', 'Отложен экземпляр ' + good_name);
          response.redirect('/catalog/' + category_id);

        });
});

//страница аналитики
app.use('/users', cfg.checkAdmin());
app.get('/users', (request,response) => {
        const query = 'select email,username,last_name,phone_num from shop.product.users;'
         var adminId;
         if (request.user){
           adminId = request.user.is_admin
         } else {
           adminId = null
         }
        connect.queryDB(query, [], function (result) {
             response.render('layouts/users.hbs',
             {
             title: "Пользователи",
             'rows' : result.rows,
             'adminId': adminId,
             'resultNotEmpty': result.rows.length !== 0
              });
        response.statusCode = 200;
    });
 });

//домашняя страница
app.use('/home', cfg.checkAuth());
app.get('/home', (request,response) => {
            var adminId;
          if (request.user){
           adminId = request.user.is_admin
          } else {
          adminId = null
          }
        response.render('index', {
            title: "Домашняя страница",
            'adminId': adminId,
            isIndex: true
            })
        response.statusCode = 200;
    });

//каталог товаров
app.get('/catalog', (request,response) => {
        const query = 'SELECT name, id, image_url FROM shop.product.categories;';

        connect.queryDB(query, [], function (result) {
            response.render('layouts/catalog.hbs',
            {
            title: "Каталог товаров",
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0
            });
        });
        response.statusCode = 200;
    });


app.get('/catalog/:id', (request,response) => {
       // const query = 'SELECT name, description, price, image_url FROM shop.product.goods where category_id=$1;'
       //const query = 'select max(shop.product.users.username) as name, max(shop.product.users.last_name) as lastName, max(shop.product.users.phone_num) as phone, max(shop.product.orders.address) as adress, sum(shop.product.goods.price) as price from shop.product.items  join shop.product.goods on items.good_id = goods.id join shop.product.users on shop.product.items.booked_by_user = shop.product.users.id join shop.product.orders on shop.product.users.id = shop.product.orders.user_id;';
       const values = [request.params.id]
       const query= `select MAX(shop.product.goods.id) as goodId,
                            MAX(shop.product.goods.name) as name,
                            MAX(shop.product.goods.category_id) as category_id,
                            MAX(shop.product.goods.description) as description,
                            MAX(shop.product.goods.image_url) as image_url,
                            MAX(shop.product.goods.price) as price,
                            count(shop.product.items.id) as in_stock
                            from shop.product.goods join shop.product.items on goods.id = items.good_id
                            where items.is_sold = false
                            and items.booked_by_user is null and goods.category_id = $1
                            group by goods.id  order by  name ;`

        connect.queryDB(query, values, function (result) {

            response.render('layouts/catalog_per_category.hbs',
            {
            title: "Каталог товаров",
            'rows' : result.rows,
            'message' : request.flash('info'),
            'userId' :  request.user ? request.user.id : null,
            'resultNotEmpty': result.rows.length !== 0
            });
        });
        response.statusCode = 200;
    });




app.get('/catalog/processory', (request,response) => {

        const query = 'select name, image_url from shop.product.goods where category_id = 1;';

        connect.queryDB(query, [], function (result) {
            response.render('layouts/catalog.hbs',
            {
            title: "Процессоры",
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0
            });
        });
        response.statusCode = 200;
});


app.listen(port,host, function(){
    console.log(`Сервер запустился по адресу://${host}:${port}`)
});