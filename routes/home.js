const cfg = require('../config/cfg');
const connect = require('../config/connect');
const fs = require("fs");
const logger = require ('../config/logger').logger;


module.exports = function (app) {

//домашняя страница
app.get('/', (request,response) =>{
        response.redirect('/home');
        response.statusCode = 200;
});
app.get('/home', (request,response) => {
        const query = fs.readFileSync("./sql/top5_per_category.sql" ).toString('utf-8');
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
     const category_query = 'select id,name from shop.product.categories'
     connect.queryDB(category_query, [], cfg.error_handler(request,response),function  (result) {
         all_results = result.rows;
         connect.queryDB(query, [1],  cfg.error_handler(request,response), function  (result) {
             cat_result1 = result.rows;
              connect.queryDB(query, [2],   cfg.error_handler(request,response),function  (result) {
                  cat_result2 = result.rows;
                  connect.queryDB(query, [3],  cfg.error_handler(request,response), function  (result) {
                      cat_result3 = result.rows;
                      connect.queryDB(query, [4],  cfg.error_handler(request,response), function  (result) {
                          cat_result4 = result.rows;
                           connect.queryDB(query, [5],   cfg.error_handler(request,response),function  (result) {
                               cat_result5 = result.rows;
                    console.log(userId)
                               all_results[0].rows = cat_result1
                               all_results[1].rows = cat_result2
                               all_results[2].rows = cat_result3
                               all_results[3].rows = cat_result4
                               all_results[4].rows = cat_result5

                               response.render('layouts/top_items.hbs',{

                                            title: "Техностор",
                                           'userId' :  userId,
                                           'adminId': adminId,
                                           'all_results' : all_results,
                                           'message' : request.flash('info'),
                                           'resultNotEmpty': all_results.length !== 0
                                           });
                               logger.info('Отображена главная страница. Показано товаров: %d',all_results.length );
                               response.statusCode = 200;


                           });
                      });
                  });
             });
         });
     })

    });

}
