//const User = require('../models/User')

module.exports.login =  function checkAuth() {
    return (req, res, next) => {
      if(req.user)
        next();
      else
        res.redirect('/login');
    };
}



module.exports.register = function (req, res) {
    res.status(200).json({
    register: 'from'
    })
}