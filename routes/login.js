const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bodyParser = require('body-parser');
const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function(app) {
//авторизация
app.get('/login', (request,response) => {


     response.render('./layouts/login.hbs', {
                 title: "Страница авторизации",
                 'message' : request.flash('info')
                 })
             response.statusCode = 200;
});

//авторизация
app.post('/login',
    passport.authenticate('local', {
    successRedirect: '/home',
    successFlash : "Welcome!",
    failureRedirect: '/login',
    failureFlash: true}),
);

//лог-аут
app.get('/logout', function(request, response){
  request.logout();
  response.redirect('/login');
});

}