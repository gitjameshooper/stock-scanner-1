var express = require('express');
var router = express.Router();

 
// define the home page route
router.get('/', function(req, res) {
  res.send('Hooper whais up');
});

router.post('/insert', function(req, res){

});
// define the about route
router.get('/stock', function(req, res) {
  res.send('Stock data');
});

module.exports = router;