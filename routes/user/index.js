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


router.route('/update')
.get(controller.updateGet)
.put(controller.updatePut)

router.route('/delete')
.get(controller.deleteGet)
.delete(controller.delete)

router.route('/logout')
.get(controller.logout)
module.exports = router