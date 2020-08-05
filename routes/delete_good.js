const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function (app) {

app.use('/edit', cfg.checkAdmin());
//app.get('/edit', (request, response) => {




app.post('/delete_good', (request,response) => {
      const query = `delete from shop.product.goods where id =$1`
          const values = [request.body.good_id];
          const good_name = request.body.name;
          connect.queryDB(query, values, cfg.error_handler(request,response), function (result) {

              request.flash('info', 'Товар'+ good_name  +'удален из каталога');
              response.redirect('back');
            });
        });





}