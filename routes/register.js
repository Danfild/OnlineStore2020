const cfg = require('../config/cfg');
const connect = require('../config/connect');
const bcrypt = require('bcryptjs');

module.exports = function(app) {

function telephoneCheck(str) {
  var patt = new RegExp(/\+7\d{3}\d{3}\d{2}\d{2}/);
  return patt.test(str);
}


app.post('/register', (request,response) => {
     const query = `select exists (select 1 from shop.product.users where username = $1)`;
     const values = [request.body.username]

     connect.queryDB(query, values , function (user_exists) {
          if  (user_exists.rows[0].exists != true){
                if (telephoneCheck(request.body.phone_num))
                {
                const query = `insert into product.users (email,username,last_name,password,phone_num,date_register, is_admin) values ($1, $2, $3, $4, $5, 'now', false)`
                const passwordToSave = bcrypt.hashSync(request.body.password, '$2b$10$1rLs8U9ML1jEMpekTBFX3.');
                const values = [request.body.email , request.body.username, request.body.last_name, passwordToSave, request.body.phone_num];
                const username = request.body.username;

                 connect.queryDB(query, values, function (result) {
                 request.flash('registration_complete', 'Регистарация завершена ' + username);
                 response.redirect('/login');
                  });
            }else{
             request.flash('info', 'Номер телефона задан не корректно');
             response.redirect('back');
            }
          }else{
          request.flash('info', 'Пользователь с таким именем уже существует');
          response.redirect('back');
          }
     })
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