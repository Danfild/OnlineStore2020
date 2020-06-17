const express = require('express')
const controller = require('../controllers/auth')//
const router = express.Router()

//localhost:3000/auth/login ЕСЛИ ЧТО_ТО НЕ РАБОТАЕТ СМОТРИ НА АДРЕС!!
router.post('/login', controller.login)
//localhost:3000/auth/register
router.post('/register', controller.register)


module.exports= router