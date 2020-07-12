const { Pool , Client } = require('pg');
const pool = new Pool();
const cfg = require('./cfg');

//коннект к базе
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

// проверка на врность пользьователя из бд
module.exports.authCheck = function(username, password, done) {
    cfg.getUser(username, function(result) {
        if (result.rows.length == 0) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        const user = result.rows[0];
        if (user.password !== password) {
            return done(null, false, {message: 'Incorrect password.'});
        }else {
            return done(null, user);
        }
    });
}