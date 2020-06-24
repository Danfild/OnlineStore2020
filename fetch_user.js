// fetch_user.js
const pg = require('pg');

module.exports = fetchUser = function (username, done) {
    // Создаем клиента базы данных. По-хорошему, здесь вы должны использовать
    // пул соединений, заранее сконфигурированный и передваемый
    // "из вне". Для простоты я использую одиночного клиента БД.
    const client = new pg.Client();

    // Устанавливаем соединение с БД.
    client.connect(function (err) {
        if (err) {
            return done(err);
        }

        // Отправляем запрос в базу.
        client.query(
            'SELECT * FROM shop.product.users WHERE username = $1::text',
            [username],
            function (err, result) {
                client.end();
                done(err, result.rows[0] || null);
            }
        );
    });
};


app.get('/products', async (request, response) => {
    const query = 'SELECT * FROM shop.product.users WHERE username = $1::text'

    queryDB(query, [], function (result) {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(jsonToHTMLTable(result.rows))
    })
})








