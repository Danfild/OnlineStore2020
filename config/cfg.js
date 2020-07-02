const { Pool , Client } = require('pg');
const pool = new Pool();
const connect = require('./connect');

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
       if(res.user.is_admin)
          next();
       else
          res.redirect('/login');
       };
      };


// проверка юзера по имени из бд
module.exports.getUser = function (username, done) {
      const query = 'SELECT *  FROM shop.product.users WHERE username = $1::text';
      const  params = [username];
      connect.queryDB(query, params, done)
  };



