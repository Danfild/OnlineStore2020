const cfg = require('../config/cfg');
const connect = require('../config/connect');


module.exports = function(app) {

//страница аналитики
app.use('/analitycs', cfg.checkAdmin());
app.get('/analitycs', (request,response) => {
            var adminId;
            if (request.user){
             adminId = request.user.is_admin
            } else {
             adminId = null
            }
        response.render('index', {
            title: "Домашняя страница",
            'adminId': adminId,
            })
        response.statusCode = 200;
    })
    }