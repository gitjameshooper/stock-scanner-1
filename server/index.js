var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Create App
var app = express();
 
// Middleware for REST API 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
 
// CORS Support
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static('public'));
app.disable('x-powered-by');

// Load the models
app.models = require('./models/index');

// Load the routes
app.routes = require('./routes/index');

app.use('/stock', app.routes.stock);
app.use('/tkcreds(.json)?/', app.routes.tkcreds);

// Listen on Port 3000
app.listen(3000);


 
module.exports = app;
