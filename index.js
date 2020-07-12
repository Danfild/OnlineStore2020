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
require('./routes/home')(app);
require('./routes/top5')(app);








//главная страница
app.get('/64564', (request,response) => {
        const query = fs.readFileSync("./sql/top5_per_category.sql" ).toString('utf-8');
        var adminId;
        var userId;
        if (request.user ){
        userId = request.user.id
        adminId= request.user.is_admin
         } else {
         userId = null
         adminId = null
        }
     const category_query = 'select id,name from shop.product.categories'
     connect.queryDB(category_query, [],  function  (result) {
         all_results = result.rows;
         connect.queryDB(query, [1],  function  (result) {
             cat_result1 = result.rows;
              connect.queryDB(query, [2],  function  (result) {
                  cat_result2 = result.rows;
                  connect.queryDB(query, [3],  function  (result) {
                      cat_result3 = result.rows;
                      connect.queryDB(query, [4],  function  (result) {
                          cat_result4 = result.rows;
                           connect.queryDB(query, [5],  function  (result) {
                               cat_result5 = result.rows;

                               all_results[0].rows = cat_result1
                               all_results[1].rows = cat_result2
                               all_results[2].rows = cat_result3
                               all_results[3].rows = cat_result4
                               all_results[4].rows = cat_result5

                               response.render('layouts/top_items.hbs',{

                                            title: "Главная Страница",
                                           'userId' :  request.user ? request.user.id : null,
                                           'adminId': adminId,
                                           'rows' : result.rows,
                                           'message' : request.flash('info'),
                                           'resultNotEmpty': result.rows.length !== 0
                                           });
                               response.statusCode = 200;
                               //response.set({ 'content-type': 'application/json; charset=utf-8' });
                               //response.send(JSON.stringify(all_results).toString('utf-8'));

                           });
                      });
                  });
             });
         });
     })





        //connect.queryDB(query, [1], function (result) {

            //response.render('layouts/top_items.hbs',
            //{
            //title: "Главная Страница",
            //'userId' :  request.user ? request.user.id : null,
            //'adminId': adminId,
            //'rows' : result.rows,
            //'message' : request.flash('info'),
            //'resultNotEmpty': result.rows.length !== 0
            //});
            //console.log(result.rows)

        //});
    });






app.listen(port,host, function(){
    console.log(`Сервер запустился по адресу://${host}:${port}`)
});