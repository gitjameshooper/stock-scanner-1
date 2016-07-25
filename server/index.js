var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Create App
var app = express();

// Connect to Mongodb
mongoose.connect("mongodb://localhost/stocksDB");
mongoose.connection.once('open', function(){ });
 
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

// Load the models
app.models = require('./models/index');

// Load the routes
app.routes = require('./routes/index');

app.use('/stock', app.routes.stock);

// Listen on Port 3000
app.listen(3000);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });




// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
