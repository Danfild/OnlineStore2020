const cfg = require('../config/cfg');
const connect = require('../config/connect');

module.exports = function(app) {
app.get('/goods/:id', (request,response) =>  {
      const values = [request.params.id]
      const query = `with free_items as (select id, good_id from product.items where is_sold = false and booked_by_user is null)
                     select MAX(shop.product.goods.id)          as id,
                            MAX(shop.product.goods.name)        as name,
                            MAX(shop.product.goods.category_id) as category_id,
                            MAX(shop.product.goods.description) as description,
                            MAX(shop.product.goods.image_url)   as image_url,
                            MAX(shop.product.goods.price)       as price,
                            count(free_items.id)                as in_stock,
                            count(free_items.id) > 0            as is_available
                     from shop.product.goods
                              left join free_items on goods.id = free_items.good_id
                     where goods.id = $1
                     order by name;`


       connect.queryDB(query, values, function (result) {
       const good = result.rows[0];
        response.render('layouts/good.hbs',
          {
          title: good.name,
          'good' : good,
          'message' : request.flash('info'),
           'userId' :  request.user ? request.user.id : null,
           //'resultNotEmpty': result.rows.length !== 0
           });
        });
           response.statusCode = 200;
      });
}