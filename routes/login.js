const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bodyParser = require('body-parser');
const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function(app) {
//авторизация
app.get('/login', (request,response) => {

     response.render('./layouts/login.hbs', {
                 title: "Страница админа"
                 })
             response.statusCode = 200;
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
app.get('/logout', function(request, response){
  request.logout();
  response.redirect('/login');
});

}