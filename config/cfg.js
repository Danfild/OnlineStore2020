const { Pool , Client } = require('pg');
const pool = new Pool();
const connect = require('./connect');



module.exports.hostname = 'http://ec2-34-229-98-104.compute-1.amazonaws.com:3000';
//проверка авторизации
module.exports.checkAuth = function () {
       return (req, res, next) => {
       if(req.user)
          next();
       else
          res.redirect('/login');
       };
      };

//проверка прав админа
module.exports.checkAdmin = function () {
       return (req, res, next) => {
       if(req.user && req.user.is_admin)
          next();
       else
          res.redirect('/');
       };
      };


// проверка юзера по имени из бд
module.exports.getUser = function (username, done) {
      const query = 'SELECT *  FROM shop.product.users WHERE email = $1::text';
      const  params = [username];
      connect.queryDB(query, params, done)
  };



