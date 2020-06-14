const path = require('path')
const express = require('express')
const { Pool , Client } = require('pg')
const fs = require("fs")
const html_tablify = require('html-tablify')

const app = express()


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
app.get('/', function (req,res) {
    res.ststusCode = 200;
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
