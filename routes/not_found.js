const logger = require ('../config/logger').logger;

module.exports.test = function(){
console.log('fdfd')
}

module.exports = function(app){


app.get('*', function(request, response){
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
  response.render('./layouts/not_found', {
                title: "404 Not Found",
                  'userId' :  userId,
                  'adminId': adminId,
                })
});

}