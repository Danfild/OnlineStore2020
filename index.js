const express = require('express');
const { Pool , Client } = require('pg');
const fs = require("fs");
const bodyParser = require('body-parser');
const html_tablify = require('html-tablify');
const app = express();
const path = require('path');

const analitycsRoutes = require('./routes/analitycs');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');

app.use(require('cors')());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// localhost:3000/название url
app.use('/analytics', analitycsRoutes);
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/order', orderRoutes);
app.use('/position', positionRoutes);

var pool = new Pool()
const client = new Client({
    user: 'admin',
    host: 'localhost',
    database: 'shop',
    password: '12345',
    port: 5432,
})

function queryDB(query, params, resultHandler) {
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
}

//конвертер json в html строку для отображения на сайте
    function jsonToHTMLTable(data) {
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

//
app.get('/', (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync("./main.html"))
})

app.get('/products', async (request, response) => {

    const query = 'SELECT * FROM shop.product.products;'

    queryDB(query, [], function (result) {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(jsonToHTMLTable(result.rows))
    })
})

app.get('/products/:id', async (request, response) => {
    const query = 'SELECT * FROM shop.product.products WHERE id=$1'
    const values = [request.params.id]

    queryDB(query, values, function (result) {
        response.setHeader('Cnotent-Type', 'text/html; charset=utf-8');
        response.send(jsonToHTMLTable(result.rows))

    })
})

app.listen(3000)
console.log('server started!')
