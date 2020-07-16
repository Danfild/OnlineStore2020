const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function (app) {
//каталог товаров
app.get('/catalog', (request,response) => {
        const query = 'SELECT name, id, image_url FROM shop.product.categories;';

        connect.queryDB(query, [], function (result) {
            response.render('layouts/catalog.hbs',
            {
            title: "Каталог товаров",
            'rows' : result.rows,
            'resultNotEmpty': result.rows.length !== 0
            });
        });
        response.statusCode = 200;
    });

app.get('/catalog/:id', (request,response) => {
       const values = [request.params.id]
       const query= `with free_items as (select id, good_id from product.items where is_sold = false and booked_by_user is null)
                     select MAX(shop.product.goods.id)          as good_id,
                            MAX(shop.product.goods.name)        as name,
                            MAX(shop.product.goods.category_id) as category_id,
                            MAX(shop.product.goods.description) as description,
                            MAX(shop.product.goods.image_url)   as image_url,
                            MAX(shop.product.goods.price)       as price,
                            count(free_items.id)        as in_stock,
                            count(free_items.id) > 0            as is_available
                     from shop.product.goods
                             left join free_items on goods.id = free_items.good_id
                     where  goods.category_id = $1
                     group by goods.id
                     order by name;`
            var userId;
            if (request.user ){
             userId = request.user.id
             } else {
             userId = null
              }
        connect.queryDB(query, values, function (result) {

            response.render('layouts/catalog_per_category.hbs',
            {
            title: "Каталог товаров",
            'rows' : result.rows,
            'message' : request.flash('info'),
            'userId' :  request.user ? request.user.id : null,
            'resultNotEmpty': result.rows.length !== 0
            });
            //console.log(request.user.id)
        });
        response.statusCode = 200;
    });
}