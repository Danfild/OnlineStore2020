const cfg = require('../config/cfg');
const connect = require('../config/connect');




module.exports = function(app)  {

//корзина
app.use('/cart', cfg.checkAuth());
app.get('/cart', (request,response) => {
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
       const values = [request.user.id];
        const query = `select max(shop.product.items.id) as item_id,
                              shop.product.goods.name    as good_name,
                              shop.product.goods.id as   good_id,
                              shop.product.goods.price   as price,
                              count(1) as quantity

                       from shop.product.items
                                join shop.product.goods on items.good_id = goods.id
                                join shop.product.users on items.booked_by_user = users.id
                       where shop.product.users.id = $1
                       group by 2, 3`


        connect.queryDB(query, values, cfg.error_handler(request,response), function (result) {
                 const total = result.rows.map(function(row){
                   return row.price * row.quantity;
                 }).reduce((a, b)  => a  + b, 0)
                console.log( total)

                response.render('./layouts/cart.hbs', {
                      title: "Корзина",
                      'total': total,
                      'userId' : userId,
                      'adminId' : adminId,
                      'rows' : result.rows,
                      'message' : request.flash('info'),
                      'resultNotEmpty': result.rows.length !== 0,
                      })
                      response.statusCode = 200;
                      });

});

app.post('/cart', (request,response) => {
        const values = [request.user.id, request.body.item_id];
        const good_name = request.body.good_name;
        const query = `update shop.product.items set booked_by_user = null
                       where shop.product.items.booked_by_user = $1 and shop.product.items.id = $2`

              connect.queryDB(query, values, cfg.error_handler(request,response),  function (result) {

                  request.flash('info', 'Товар убран из корзины ' + good_name);
                  response.redirect('back');
                });

            });

}

