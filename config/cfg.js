const { Pool , Client } = require('pg');
const pool = new Pool();
const html_tablify = require('html-tablify');


//авторизация
module.exports.checkAuth = function () {
                 return (req, res, next) => {
                     if(req.user)
                         next();
                     else
                     res.redirect('/login');
                     };
                 };

module.exports.queryDB = function (query, params, resultHandler) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Cannot connect to the DB" + err);
        }
        client.query(query, params, function (err, result) {
            done();
            if (err) {
                console.log(err);
            }
            resultHandler(result)
        })
    })
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