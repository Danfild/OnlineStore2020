const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function(app) {

app.post('/register', (request,response) => {
         const query = `insert into product.users (email,username,last_name,password,phone_num, is_admin) values ($1, $2, $3, $4, $5, false)`
              const values = [request.body.email , request.body.username, request.body.last_name, request.body.password, request.body.phone_num];
              const username = request.body.username;


              connect.queryDB(query, values, function (result) {
                  request.flash('info', 'Регистарация завершена ' + username);
                  response.redirect('back');
                });

});
//регистрация
app.get('/register', (request,response) => {

    response.render('./layouts/register.hbs' , {
            title: 'Регистарация пользователя',
            'message' : request.flash('info')
        });
        response.statusCode = 200;
});
}