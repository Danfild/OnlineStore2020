const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function (app) {
//запрос
app.post('/book_good',  (request,response) => {
      const query = `update shop.product.items set booked_by_user = $1
                     where id = (select id from product.items where good_id = $2 and booked_by_user is null and is_sold = false limit 1)`

      const values = [request.user.id , request.body.goodId];
      const good_name = request.body.name;
      connect.queryDB(query, values, function (result) {

          request.flash('info', 'Добавлено в корзину: ' + good_name);
          response.redirect('back');
        });
    });
}