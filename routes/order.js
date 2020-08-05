const cfg = require('../config/cfg');
const connect = require('../config/connect');

module.exports = function(app) {

//заказы
app.use('/order', cfg.checkAuth());
app.get('/order', (request,response) => {
         const values = [request.user.id];
          var username;
          if (request.user && request.user.username ){
           username = request.user.username
          } else {
           username = null
          }
          var adminId;
          if (request.user){
          adminId = request.user.is_admin
          } else {
          adminId = null
          }
          var userId;
          if(request.user){
          userId = request.user.id
          }else{
          userId = null
          }

        const query = `select shop.product.items.id       as good_id,
                       shop.product.goods.name            as good_name,
                       shop.product.goods.price           as good_price,
                       shop.product.users.username        as user_name,
                       shop.product.users.email           as email

                       from shop.product.items
                       join shop.product.goods on items.good_id = goods.id
                       join shop.product.users on items.booked_by_user = users.id
                       where shop.product.users.id = $1`

        connect.queryDB(query, values, function (result) {
        const user = result.rows[0];
        const total = result.rows.map(function(row) {
                           return row.good_price;
                         }).reduce((a, b) => a + b, 0)
        response.render('./layouts/order.hbs', {
              title: "Корзина",
              'total': total,
              'userId' : userId,
              'user' : user,
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
             const email = [request.body.email]

            connect.queryDB(order_query, values, function (result) {
                order_id = [result.rows[0].id, request.user.id]

                    connect.queryDB(items_query, order_id, function (result) {

                    request.flash('info', 'Заказ оформле,информация о заказе поступила на вашу почту.');
                    response.redirect('/home');
                     })
                });

            });

app.use('/orders', cfg.checkAdmin());
app.get('/orders', (request,response) => {
            var adminId;
            if (request.user){
            adminId = request.user.is_admin
            } else {
            adminId = null
            }
            var userId;
            if(request.user){
            userId = request.user.id
            }else{
            userId = null
            }
            const query = `select shop.product.users.email                                     as email,
                                  shop.product.orders.id                                       as id,
                                  shop.product.users.username                                   as username,
                                  shop.product.users.phone_num                                 as phone,
                                  shop.product.orders.address                                 as address,
                                  to_char(shop.product.orders.order_date, 'DD Mon YYYY HH:MI:SS') as date,
                                  shop.product.orders.price                                   as price,
                                  shop.product.orders.order_status                             as status


                           from shop.product.orders
                                    join shop.product.users on orders.user_id = users.id
                                    order by date`
            const status_dictionary = {'created':'Создан','send': 'Отправлен','delivered':'Доставляется','canceled':'Отменён'}

connect.queryDB(query, [], function (result) {
        result.rows.forEach( row => {row.status = status_dictionary[row.status]})
        response.render('./layouts/admin_orders.hbs',
        {
            title: "Информация о заказах",
            'rows' : result.rows,
            'message' :request.flash('info'),
            'resultNotEmpty': result.rows.length !== 0
             });
        response.statusCode = 200;
     });
    });

app.get('/orders/:id', (request,response) => {
        const values = [request.params.id]
        const query = `select shop.product.orders.id                                          as id,
                              shop.product.users.username                                     as username,
                              shop.product.users.phone_num                                    as phone,
                              shop.product.users.email                                        as email,
                              shop.product.orders.address                                     as address,
                              to_char(shop.product.orders.order_date, 'DD Mon YYYY HH:MI:SS') as date,
                              shop.product.orders.price                                       as price,
                              shop.product.orders.order_status                                as status,
                              shop.product.goods.name                                         as good_name,
                              shop.product.goods.price                                        as good_price,
                              shop.product.goods.image_url                                    as image,
                              shop.product.items.good_id                                      as good_id

                       from shop.product.orders
                                join shop.product.users on orders.user_id = users.id
                                join shop.product.items on orders.id = items.order_id
                                join shop.product.goods on items.good_id = goods.id
                       where orders.id = $1`

        connect.queryDB(query, values, function (result) {
              const  date = result.rows[0].date;
              const  address = result.rows[0].address;
              const  username = result.rows[0].username;
              const  email = result.rows[0].email;
              const  phone = result.rows[0].phone;
              const  order_price = result.rows[0].price;
             response.render('layouts/admin_order_info.hbs',
             {
             title: "Заказ от " + date,
             'date' : date,
             'address' : address,
             'phone' : phone,
             'username' : username,
             'email' : email,
             'order_price': order_price,
             'rows' : result.rows,
             'resultNotEmpty': result.rows.length !== 0
              });
        response.statusCode = 200;
    });
 });

app.post('/update_order', (request,response) => {
        const values = [request.body.id,request.body.order_status ];
        const query = `update shop.product.orders
                       set order_status = $2
                       where id = $1;`
        connect.queryDB(query, values, function (result) {

                request.flash('info', 'Стасус заказа обновлен');
                response.redirect('back');
                })
            });

}




