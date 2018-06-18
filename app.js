var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var routes = require('./routes');
var port = 3000;

app.set('view engine','pug');
app.set('views','./views');

app.use(bodyParser.urlencoded({extended : false}))
app.use('/',routes);

app.get('/',(req,res)=>{
    res.redirect('/user/welcome');
})

app.listen(port,(req,res)=>{
    console.log('Connected port '+port+'!')
})