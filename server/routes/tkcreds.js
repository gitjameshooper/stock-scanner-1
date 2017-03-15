var express = require('express');
var fs = require('fs');
var router = express.Router();

// tk route
 

router.get('/', function(req, res) {
    
      
    	 fs.readFile('./server/json/tk-creds.json', function(err, data){
                if(err){
                    console.log(err);
                }
                res.send(JSON.parse(data));
         });
        
   
});


module.exports = router;