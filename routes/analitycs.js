const cfg = require('../config/cfg');
const connect = require('../config/connect');



module.exports = function(app) {

//страница аналитики
//app.use('/analitycs', cfg.checkAdmin());
app.get('/analitycs', (request,response) => {
        const query= `with sold_items as (select id, good_id from product.items where is_sold = true)

                      select MAX(shop.product.goods.name) as good_name,
                             shop.product.goods.id as id,
                             count(sold_items.id)       as sold_times
                      from shop.product.goods
                               left join sold_items on goods.id = sold_items.good_id
                      group by goods.id
                      order by sold_times desc
                      limit 10`;
        const total_query = `select EXTRACT(MONTH FROM now()) as month, coalesce(sum(price), 0) as total
                             from shop.product.orders
                             where EXTRACT(YEAR FROM now()) = EXTRACT(YEAR FROM order_date)
                               and EXTRACT(MONTH FROM now()) = EXTRACT(MONTH FROM order_date)
                             union
                             select EXTRACT(MONTH FROM now()) - 1 as month, coalesce(sum(price), 0) as total
                             from shop.product.orders
                             where EXTRACT(YEAR FROM now()) = EXTRACT(YEAR FROM order_date)
                               and EXTRACT(MONTH FROM now()) - 1 = EXTRACT(MONTH FROM order_date)
                             union
                             select EXTRACT(MONTH FROM now()) - 2 as month, coalesce(sum(price), 0) as total
                             from shop.product.orders
                             where EXTRACT(YEAR FROM now()) = EXTRACT(YEAR FROM order_date)
                               and EXTRACT(MONTH FROM now()) - 2 = EXTRACT(MONTH FROM order_date);`

        connect.queryDB(query, [], cfg.error_handler(request,response), function (result) {
            const data_set = result.rows.map(function(row){
            return row.sold_times
            })
            const data_good_name = result.rows.map(function(row){
            return '/' + row.good_name + '/'
            })
            console.log(data_good_name);
        connect.queryDB(total_query,[], cfg.error_handler(request,response), function (result) {
            const month  = result.rows.map(function(row){
            return row.month
            });
            const total  = result.rows.map(function(row){
            return row.total
            });

        response.render('./layouts/test.hbs',{
                title: 'Аналитическая сводка',
                'data_set': data_set,
                'good_name': data_good_name,
                'month': month,
                'total': total
        });
        response.statusCode = 200;
        });
        });
    });
    }