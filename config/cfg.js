const { Pool , Client } = require('pg');
const pool = new Pool();
const connect = require('./connect');
const logger = require ('./logger').logger;


module.exports.error_handler = error_handler =   function (request, response){
         return (err) => {
         logger.error(err);
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
     response.render('./layouts/500.hbs', {
        title: "500 internal server error",
        'userId' :  userId,
        'adminId': adminId,
        })

}
};

module.exports.hostname = 'http://ec2-34-229-98-104.compute-1.amazonaws.com:3000';
//проверка авторизации
module.exports.checkAuth = function () {
       return (request, response, next) => {
       if(request.user)
          next();
       else
          response.redirect('/login');
       };
      };

//проверка прав админа
module.exports.checkAdmin = function () {
       return (request, response, next) => {
       if(request.user && request.user.is_admin)
          next();
       else
          response.redirect('/');
       };
      };


// проверка юзера по имени из бд
module.exports.getUser = function (username,done) {
      const query = 'SELECT *  FROM shop.product.users WHERE email = $1::text';
      const  params = [username];
      connect.queryDB(query, params,error_handler, done)
  };



