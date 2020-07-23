const cfg = require('../config/cfg');
const connect = require('../config/connect');



module.exports = function(app) {
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
             'resultNotEmpty': result.rows.length !== 0
              });
        response.statusCode = 200;
    });
 });
}