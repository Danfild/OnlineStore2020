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


app.use(multer({storage:storageConfig}).single("image_url"));
app.use(multer({dest:"uploads"}).single("image_url"));
app.post('/create_items', (request,response) => {
            const query = `insert into product.goods (name,category_id, price,
             description, full_description, image_url) values ($1, $2, $3, $4 , $5, $6)`
            const values = [request.body.name, request.body.category_id, request.body.price, request.body.description,
            request.body.full_description, request.body.image_url];
            console.log(values);
            const name = request.body.name;
                //console.log(image_url);


             connect.queryDB(query, values, function (result) {
                    request.flash('Товар ' + name + 'добавлен в каталог.');
                    response.redirect('back');
                     });


});


 //страницы администратора
 app.use('/admin', cfg.checkAdmin());
 app.get('/admin', (request,response) => {
          var adminId;
          if (request.user){
              adminId = request.user.is_admin
              } else {
              adminId = null
              }
              response.render('./layouts/create_items.hbs',
              {
              title: "Страница админа",
              'userId' : request.user ? request.user.id : null,
              'adminId': adminId,
              isIndex: true
              });
         response.statusCode = 200;
         });
 }



