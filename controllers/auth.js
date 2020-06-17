//const User = require('../models/User')

module.exports.login =  function (req, res) {

      res.status(200).json({
      login:
        {
        username: req.body.username,
        password: req.body.password
        }
      })

}

module.exports.register = function (req, res) {
    res.status(200).json({
    register: 'from'
    })
}