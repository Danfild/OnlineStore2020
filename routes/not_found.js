
module.exports = function(app){


app.get('*', function(request, response){

  response.render('./layouts/not_found', {
                title: "404 Not Found",
                })
});


}