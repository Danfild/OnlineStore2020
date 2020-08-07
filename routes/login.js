const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bodyParser = require('body-parser');
const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function(app) {

app.get('/login', (request,response) => {
     var adminId;
           if (request.user){
           adminId = request.user.is_admin
           } else {
           adminId = null
           }
           var userId;
           if(request.user){
           userId = request.user.id
           }else{
           userId = null
           }

     response.render('./layouts/login.hbs', {
                 title: "Страница авторизации",
                 'adminId': adminId,
                 'userId' : userId,
                 'message' : request.flash('registration')
                 })
             response.statusCode = 200;
});


app.post('/login',
    passport.authenticate('local', {
    successRedirect: '/home',
    successFlash : "Welcome!",
    failureRedirect: '/login',
    failureFlash: true}),
);


app.get('/logout', function(request, response){
  request.logout();
  response.redirect('/login');
});

}