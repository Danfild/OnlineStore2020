const cfg = require('../config/cfg');


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
      response.render('index', {
          title: 'Добавление товара',
          'adminId': adminId
      })
      response.statusCode = 200;
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
              'adminId': adminId,
              });
         response.statusCode = 200;
         });
 }



