const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function(app) {

//заказы
app.use('/order', cfg.checkAuth());
app.get('/order', (request,response) => {
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
                       shop.product.goods.price    as good_price,
                       shop.product.users.username as user_name

                       from shop.product.items
                       join shop.product.goods on items.good_id = goods.id
                       join shop.product.users on items.booked_by_user = users.id
                       where shop.product.users.id = $1`

        connect.queryDB(query, values, function (result) {
        const total = result.rows.map(function(row) {
                           return row.good_price;
                         }).reduce((a, b) => a + b, 0)
        response.render('./layouts/order.hbs', {
              title: "Корзина",
              'total': total,
              'userId' : userId,
              'username': username,
              'message' : request.flash('info'),
              'rows' : result.rows,
              'resultNotEmpty': result.rows.length !== 0
              })
              response.statusCode = 200;
              });

    });

app.post('/order', (request,response) => {

            const values = [request.user.id , request.body.address, request.body.price];
            const order_query = `insert into shop.product.orders (user_id, address, price, order_date)
                          values ($1, $2, $3, 'now') returning orders.id`;

            const items_query =`update shop.product.items
                                set order_id = $1, is_sold = true, booked_by_user = null
                                where booked_by_user = $2`;

            connect.queryDB(order_query, values, function (result) {
                order_id = [result.rows[0].id, request.user.id]
                    connect.queryDB(items_query, order_id, function (result) {

                    request.flash('info', 'Заказ оформлен');
                    response.redirect('back');
                     })
                console.log(result.rows[0].id , request.user.id)
                });

            });

}



