const fs = require("fs");
const cfg = require('../config/cfg');
const connect = require('../config/connect');




module.exports = function(app) {
//главная страница
//app.get('/', (request,response) => {
        const query = fs.readFileSync("./sql/top5_per_category.sql" ).toString('utf-8');
        var adminId;
        var userId;
        if (request.user ){
        userId = request.user.id
        adminId= request.user.is_admin
         } else {
         userId = null
         adminId = null
        }
      const category_query = 'select id,name from shop.product.categories'
                     connect.queryDB(category_query, [],  function  (result) {
                          var all_results_enriched = result.rows.map(function(category) {

                          var enriched_element;
                          const promise = await connect.queryDB(query, [category.id], function (category_result) {
                               return {
                               'id': category.id,
                               'name': category.name,
                               'rows': category_result.rows
                               }
                             });
                          promise.then(function(value) {
                                    enriched_element = value
                                    }, function(reason) {
                                    console.log(reason)
                          });

                          console.log(enriched_element);
                          return enriched_element;
                          });

             response.statusCode = 200;
             response.end(JSON.stringify(all_results_enriched).toString('utf-8'));
                //console.log(category);
       });
}