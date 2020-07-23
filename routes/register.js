const cfg = require('../config/cfg');
const connect = require('../config/connect');
const bcrypt = require('bcrypt');

module.exports = function(app) {

function telephoneCheck(str) {
  var patt = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);
  return patt.test(str);
}

app.post('/register', (request,response) => {
                if (telephoneCheck(request.body.phone_num))
                {
                const query = `insert into product.users (email,username,last_name,password,phone_num, is_admin) values ($1, $2, $3, $4, $5, false)`
                const passwordToSave = bcrypt.hashSync(request.body.password, '$2b$10$1rLs8U9ML1jEMpekTBFX3.');
                const values = [request.body.email , request.body.username, request.body.last_name, passwordToSave, request.body.phone_num];
                const username = request.body.username;


                 connect.queryDB(query, values, function (result) {
                 request.flash('info', 'Регистарация завершена ' + username);
                 response.redirect('/login');
                  });
            }else{
             request.flash('info', 'Номер телефона задан не корректно');
             response.redirect('back');
            }

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