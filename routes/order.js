const cfg = require('../config/cfg');
const connect = require('../config/connect');



module.exports = function(app){


app.use('/orders', cfg.checkAdmin());
app.get('/orders', (request,response) => {
        const query = `select max(shop.product.users.username) as name,
                       max(shop.product.users.last_name) as lastName,
                       max(shop.product.users.phone_num) as phone,
                       max(shop.product.orders.address) as adress,
                       sum(shop.product.goods.price) as price from shop.product.items
                       join shop.product.goods on items.good_id = goods.id
                       join shop.product.users on shop.product.items.booked_by_user = shop.product.users.id
                       join shop.product.orders on shop.product.users.id = shop.product.orders.user_id;`
        var adminId;
        if (request.user){
           adminId = request.user.is_admin
        } else {
           adminId = null
        }
        connect.queryDB(query, [], function (result) {
        response.render('./layouts/orders.hbs', {
              title: "Корзина",
              'rows' : result.rows,
              'adminId': adminId,
              'resultNotEmpty': result.rows.length !== 0
              })
              response.statusCode = 200;
              });

    });

app.use('/order', cfg.checkAuth());
app.get('/order', (request,response) => {

        var userId;
        if (request.user ){
          userId = request.user.id
        } else {
          userId = null
        }
       const values = [request.user.id];
        const query = `select shop.product.items.id  as good_id,
                              shop.product.goods.name     as good_name,
                              shop.product.goods.price    as price,
                              shop.product.users.username as user_name

                       from shop.product.items
                                join shop.product.goods on items.good_id = goods.id
                                join shop.product.users on items.booked_by_user = users.id
                       where shop.product.users.id = $1`

        connect.queryDB(query,values, function (result) {

                response.render('./layouts/order.hbs', {
                      title: "Корзина",
                      'rows' : result.rows,
                      'message' : request.flash('info'),
                      'resultNotEmpty': result.rows.length !== 0,
                      //'userId' :  request.user ? request.user.id : null,
                      })
                      response.statusCode = 200;
                    console.log(request.user.id)
                      });
});

app.post('/order', (request,response) => {
        const values = [request.user.id, request.body.good_id];
        const good_name = request.user.good_name;
        const query = `update shop.product.items set booked_by_user = null
        where shop.product.items.booked_by_user = $1 and shop.product.items.id = $2`


               console.log(request.user.id)
              connect.queryDB(query, values, function (result) {

                  request.flash('info', 'Товар убран из корзины ' + good_name);
                  response.redirect('back');
                });
                console.log(request.body.good_id)
            });

}