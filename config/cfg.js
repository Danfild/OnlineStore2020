const { Pool , Client } = require('pg');
const pool = new Pool();
const html_tablify = require('html-tablify');
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
       if(res.user)
          next();
       else
          res.redirect('/login');
       };
      };


// проверка юзера по имени из бд
module.exports.getUser = function (username, done) {
      const query = 'SELECT username,password  FROM shop.product.users WHERE username = $1::text';
      const  params = [username];
      connect.queryDB(query, params, done)
  };

//конвертер json в html строку для отображения на сайте
module.exports.jsonToHTMLTable = function (data) {
        var table = html_tablify.tablify ({
            data: data
        })
    return `<!DOCTYPE html>
<html>
<body>
<h1>Products</h1>`
        + table +
        `</body>
</html>
`
}