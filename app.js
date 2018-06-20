var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var routes = require('./routes');
var port = 3000;
var methodOverride = require('method-override')

app.set('view engine','pug');
app.set('views','./views');

app.use(bodyParser.urlencoded({extended : false}))
app.use(methodOverride((req,res)=>{
    if(req.body && typeof req.body ==='object' && req.body._method){
        var method = req.body._method
        console.log('method ::',method)
        delete req.body._method
        return method
    }
}))
app.use('/',routes);

app.get('/',(req,res)=>{
    res.redirect('/user/welcome');
})
app.listen(port,(req,res)=>{
    console.log('Connected port '+port+'!')
})