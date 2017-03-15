var express = require('express');
var router = express.Router();
var stockModel = require('../models/stock');

// define the home page route
router.get('/insert/:symbol/:price', function(req, res) {

    var stock = new stockModel({ symbol: req.params.symbol, price: req.params.price });
    stock.save(function(err, data) {
        res.send('Stock Symbol saved');
        if (err) console.log(err);
        else console.log('Saved : ', data);
    });
});

router.get('/:symbol', function(req, res) {
    
    stockModel.find({ symbol: req.params.symbol }, function(err, docs) {
    	// need to write error checking
        res.send(docs);
    });
});


module.exports = router;