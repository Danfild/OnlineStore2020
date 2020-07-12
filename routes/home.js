const cfg = require('../config/cfg');



module.exports = function (app) {

//домашняя страница
app.use('/home', cfg.checkAuth());
app.get('/home', (request,response) => {
            var adminId;
          if (request.user){
           adminId = request.user.is_admin
          } else {
          adminId = null
          }
        response.render('index', {
            title: "Домашняя страница",
            'adminId': adminId,
            isIndex: true
            })
        response.statusCode = 200;
    });

}