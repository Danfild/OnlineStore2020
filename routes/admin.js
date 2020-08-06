const cfg = require('../config/cfg');
const connect = require('../config/connect');
const multer  = require("multer");


const storageConfig = multer.diskStorage({
    destination: (request, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (request, file, cb) =>{
        cb(null, file.originalname);
    }
});

 module.exports = function (app) {
 //добавление товара
  app.use('/admin/create_items', cfg.checkAdmin());
  app.get('/admin/create_items', (request,response) => {
              var adminId;
              var userId;
                 if (request.user ){
                 userId = request.user.id
                 adminId= request.user.is_admin
                 } else {
                 userId = null
                 adminId = null
                  }
      response.render('./layouts/create_items.hbs', {
          title: 'Добавление товара',
          'message' : request.flash('info'),
          'adminId': adminId,
          'userId' : userId
      })

      response.statusCode = 200;
  });


//app.use(multer({storage:storageConfig}).single("image_url"));
//app.use(multer({dest:"uploads"}).single("image_url"));
app.post('/create_items', (request,response) => {

            const create_good_query = `insert into product.goods (name,category_id, price,
             description, full_description, image_url) values ($1, $2, $3, $4 , $5, $6) returning goods.id`
            const create_good_values = [request.body.name, request.body.category_id, request.body.price, request.body.description,
            request.body.full_description, request.body.image_url];
            const name = request.body.name;
            const create_items_query = `INSERT into product.items (good_id)
                                         SELECT t.*
                                         FROM   generate_series(1,$1) i
                                         CROSS  JOIN LATERAL (SELECT $2::int) t`


            connect.queryDB(create_good_query,create_good_values, cfg.error_handler(request,response), function (result) {
                const create_items_values = [ request.body.count , result.rows[0].id]
                connect.queryDB(create_items_query, create_items_values,cfg.error_handler(request,response), function (ignored) {
                    request.flash('info','Товар ' + name + 'добавлен в каталог.');
                    response.redirect('back');
                    });

             })

});

 }



