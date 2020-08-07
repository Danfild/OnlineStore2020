const cfg = require('../config/cfg');
const connect = require('../config/connect');
const logger = require ('../config/logger').logger;

module.exports = function(app) {
app.get('/goods/:id', (request,response) =>  {
      const values = [request.params.id]
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
      const query = `with free_items as (select id, good_id from product.items where is_sold = false and booked_by_user is null)
                     select MAX(shop.product.goods.id)          as id,
                            MAX(shop.product.goods.name)        as name,
                            MAX(shop.product.goods.category_id) as category_id,
                            MAX(shop.product.goods.description) as description,
                            MAX(shop.product.goods.full_description) as full,
                            MAX(shop.product.goods.image_url)   as image_url,
                            MAX(shop.product.goods.price)       as price,
                            count(free_items.id)                as in_stock,
                            count(free_items.id) > 0            as is_available
                     from shop.product.goods
                              left join free_items on goods.id = free_items.good_id
                     where goods.id = $1
                     order by name;`

       if (values == 'favicon.ico' ){
       response.redirect('/catalog')
       }else{
       connect.queryDB(query, values, cfg.error_handler(request,response), function (result) {
       const good = result.rows[0];
       if(good.id == null ){
       response.redirect('/not_found')
        }else{
        response.render('layouts/good.hbs',
          {
          title: good.name,
          'good' : good,
          'message' : request.flash('info'),
          'adminId' : adminId,
          'userId' :  userId,
           });
           response.statusCode = 200;
            logger.info('goods values: ' + values.toString());
            }
        });
        }

      });



app.post ('/add_good', (request,response) =>{

            const values = [ request.body.count, request.body.good_id]
            const query = `INSERT into product.items (good_id)
                           SELECT t.*
                           FROM   generate_series(1,$1) i
                           CROSS  JOIN LATERAL (SELECT $2::int) t`
            connect.queryDB(query, values, cfg.error_handler(request,response), function (result) {
            logger.info(`Товар ${request.body.good_id} успешно добавлен на склад. Количество: ${request.body.count}`)
            request.flash('info', `Товар успешно добавлен на склад. Количество: ${request.body.count}`);
            response.redirect('back');
            });
});

app.post ('/good_update_price', (request,response) =>{
            const query = `update shop.product.goods set price = $1 where id = $2;`;
            const values = [request.body.price, request.body.id]

            connect.queryDB(query, values, cfg.error_handler(request,response), function (result) {

            request.flash('info', 'Цена товара изменена');
            response.redirect('back');
            });
});
app.post ('/user_update_description', (request,response) =>{
            const query = `update shop.product.goods set description = $1 where id = $2;`;
            const values = [request.body.description, request.body.id]

            connect.queryDB(query, values, cfg.error_handler(request,response), function (result) {

            request.flash('info', 'Описание изменено');
            response.redirect('back');
            });
});
app.post ('/user_update_full', (request,response) =>{
            const query = `update shop.product.goods set full_description = $1 where id = $2`;
            const values = [request.body.full, request.body.id]

            connect.queryDB(query, values, cfg.error_handler(request,response), function (result) {

            request.flash('info', 'Полное описание товара изменено');
            response.redirect('back');
            });
});

}