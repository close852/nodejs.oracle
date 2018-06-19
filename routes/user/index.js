const express = require('express');
var router = express();
const controller = require('./user.controller')

router.get('/welcome',controller.welcome);

router.route('/login')
.get(controller.loginGet)
.post(controller.loginPost)

router.route('/register')
.get(controller.registerGet)
.post(controller.registerPost)

module.exports = router