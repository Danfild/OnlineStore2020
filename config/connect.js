const { Pool , Client } = require('pg');
const pool = new Pool();
const cfg = require('./cfg');
const bcrypt = require('bcryptjs');
const logger = require ('../config/logger').logger;

//коннект к базе
module.exports.queryDB = function (query, params, error_handler_with_response,resultHandler) {
    pool.connect(function (err, client, done) {
        if (err) {
            logger.error("Cannot connect to the DB" + err);
        }
        client.query(query, params, function (err, result) {
            done();
            if (err) {
             logger.error("Cannot query  the DB" + err);
             logger.error("query: " + query);
             logger.error("params: " + params);
             logger.error('Cannot read property ' + params)
             error_handler_with_response(err)
            }else{
            resultHandler(result)
            }
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
         const passwordFromUser = bcrypt.hashSync(password, '$2b$10$1rLs8U9ML1jEMpekTBFX3.')

        if (user.password !== passwordFromUser) {
            return done(null, false, {message: 'Incorrect password.'});
        }else {
            return done(null, user);
        }
    });
}