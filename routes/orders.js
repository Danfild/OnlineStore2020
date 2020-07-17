const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function(app) {

//заказы
app.use('/orders', cfg.checkAuth());
app.get('/orders', (request,response) => {
         const values = [request.user.id];

          var username;
          var userId;
          if (request.user && request.user.username ){
           userId = request.user.id,
           username = request.user.username
          } else {
           userId = null,
           username = null
          }
        const query = `select shop.product.items.id       as good_id,
                       shop.product.goods.name     as good_name,
                       shop.product.goods.price    as price,
                       shop.product.users.username as user_name

                       from shop.product.items
                       join shop.product.goods on items.good_id = goods.id
                       join shop.product.users on items.booked_by_user = users.id
                       where shop.product.users.id = $1`

        connect.queryDB(query, values, function (result) {
        const total = result.rows.map(function(row) {
                           return row.price;
                         }).reduce((a, b) => a + b, 0)
        response.render('./layouts/orders.hbs', {
              title: "Корзина",
              'total': total,
              'userId' : userId,
              'username': username,
              'rows' : result.rows,
              'resultNotEmpty': result.rows.length !== 0
              })
              response.statusCode = 200;
              });

    });

app.post('/orders', (request,response) => {
             const values = [request.user.id , request.body.address, request.body.total];


            const query = `insert into shop.product.orders (user_id, address, price, order_date)
                          values ($1, $2, $3, 'now')`

             connect.queryDB(query, values, function (result) {

              //request.flash('info',/);
              response.redirect('/home');
             });

});

}



