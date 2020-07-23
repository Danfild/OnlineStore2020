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

app.use('/orders', cfg.checkAdmin());
app.get('/orders', (request,response) => {
            const query = `
select max(shop.product.users.email)         as email,
       max(shop.product.users.username)      as username,
       max(shop.product.users.phone_num)     as phone,
       max(shop.product.orders.address)      as address,
       max(shop.product.orders.order_date)   as date,
       max(shop.product.orders.price)        as price,
       max(shop.product.orders.order_status) as status


from shop.product.items
         join shop.product.orders on items.order_id = orders.id
         join shop.product.users on orders.user_id = users.id

`


 connect.queryDB(query, [], function (result) {
        response.render('./layouts/admin_orders.hbs',
        {
            title: "Информация о заказах",
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0
             });
        response.statusCode = 200;
     });
    });


}



