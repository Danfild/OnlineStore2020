const objection = require('pg')
const Schema = objection.Schema

const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }

})


module.exports = objection.model('categories', categorySchema)