const cfg = require('../config/cfg');
const connect = require('../config/connect');



module.exports = function(app) {
app.use('/users', cfg.checkAdmin());
app.get('/users', (request,response) => {
        const query = `select id, email, username, last_name, phone_num, to_char((date_register), 'DD Mon YYYY ') as date
                       from shop.product.users;`
         var adminId;
         if (request.user){
           adminId = request.user.is_admin
         } else {
           adminId = null
         }
        connect.queryDB(query, [], function (result) {

             response.render('layouts/users.hbs',
             {
             title: "Пользователи",
             'rows' : result.rows,
             'resultNotEmpty': result.rows.length !== 0
              });
        response.statusCode = 200;
    });
 });


app.get('/users/:id', (request,response) => {
         const values = [request.params.id]
         const orders_query = `select shop.product.orders.address as address,
                                      shop.product.orders.id as id,
                                shop.product.orders.price as price,
                                shop.product.orders.order_status as order_status,
                                to_char((shop.product.orders.order_date), 'DD Mon YYYY HH:MI:SS') as order_date

                               from shop.product.orders where user_id = $1`;

         const query = `select shop.product.users.email                                            as email,
                               shop.product.users.username                                         as user_name,
                               shop.product.users.last_name                                        as last_name,
                               shop.product.users.phone_num                                        as phone,
                               to_char((shop.product.users.date_register), 'DD Mon YYYY ') as date_register

                        from shop.product.users
                        where id = $1`;

         connect.queryDB(query, values, function (result) {
         connect.queryDB(orders_query, values, function (orders_result) {
               const user = result.rows[0];
              response.render('layouts/users_id.hbs',
              {
              title: 'Пользователь ' + user.user_name,
              'user': user,
              'rows' : orders_result.rows,
              'resultNotEmpty': orders_result.rows.length !== 0
               });
         response.statusCode = 200;
         });
     });
  });

app.use('/user_order/:id', cfg.checkAuth());
app.get('/user_order/:id', (request,response) => {
        const values = [request.params.id]
        const query = `select orders.price as order_price,
                              orders.order_status as order_status,
                              to_char((shop.product.orders.order_date), 'DD Mon YYYY ') as date,
                              goods.name as good_name,
                              goods.id as good_id,
                              goods.image_url as image,
                              goods.price as price
                       from shop.product.orders
                                join shop.product.items on orders.id = items.order_id
                                join shop.product.goods on items.good_id = goods.id
                       where orders.id =$1`

        connect.queryDB(query, values, function (result) {
              const  date = result.rows[0].date;
              const  status = result.rows[0].order_status;

             response.render('layouts/user_order.hbs',
             {
             title: "Заказ от " + date,
             'status': status,
             'date' : date,
             'price': result.rows[0].order_price,
             'rows' : result.rows,
             'resultNotEmpty': result.rows.length !== 0
              });
        response.statusCode = 200;
    });
 });

}

