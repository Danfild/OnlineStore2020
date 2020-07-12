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

}