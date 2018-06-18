const express = require('express');
var router = express();
const controller = require('./user.controller')

router.get('/welcome',controller.welcome);

router.get('/login',controller.login)
router.post('/login',controller.postLogin)



module.exports = router