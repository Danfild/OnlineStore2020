const cfg = require('../config/cfg');
const connect = require('../config/connect');




module.exports = function(app)  {

//корзина
app.use('/cart', cfg.checkAuth());
app.get('/cart', (request,response) => {

       const values = [request.user.id];
        const query = `select shop.product.items.id       as good_id,
                              shop.product.goods.name     as good_name,
                              shop.product.goods.price    as price,
                              shop.product.users.username as user_name

                       from shop.product.items
                                join shop.product.goods on items.good_id = goods.id
                                join shop.product.users on items.booked_by_user = users.id
                       where shop.product.users.id = $1`


        connect.queryDB(query,values, function (result) {
                 const total = result.rows.map(function(row) {
                   return row.price;
                 }).reduce((a, b) => a + b, 0)
                response.render('./layouts/cart.hbs', {
                      title: "Корзина",
                      'total': total,
                      'userId' : request.user ? request.user.id : null,
                      'rows' : result.rows,
                      'message' : request.flash('info'),
                      'resultNotEmpty': result.rows.length !== 0,
                      })
                      response.statusCode = 200;
                      });

});

app.post('/cart', (request,response) => {
        const values = [request.user.id, request.body.good_id];
        const good_name = request.body.good_name;
        const query = `update shop.product.items set booked_by_user = null
                       where shop.product.items.booked_by_user = $1 and shop.product.items.id = $2`

              connect.queryDB(query, values, function (result) {

                  request.flash('info', 'Товар убран из корзины ' + good_name);
                  response.redirect('back');
                });

            });

}

