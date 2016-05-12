 var OAuth = require('./oauth').OAuth;

    var credentials = {
        consumer_key: "oueUNFo7JquoQkUZCyGCByADVQ1OEqwN3LI76UzqZbs2",
        consumer_secret: "0SXgcxSCdK1rvhk8ziUWSuRl3flC1R23gzMCIR6T0pg0",
        access_token: "4P6i4qbS1xaJSHjXtVx4CHjcQqkASex1pq8XUWIGkL86",
        access_secret: "lnktvF16Bb9obBYtuhHgMY44rIQds1FnJZGfqB9PuoU5"
    };
  
var oa = new OAuth(null, null, credentials.consumer_key, credentials.consumer_secret, "1.0", null, "HMAC-SHA1");
var request = oa.get("https://stream.tradeking.com/v1/market/quotes?symbols=AAPL", 
credentials.access_token, 
credentials.access_secret);

request.on('response', function (response) {
   
    response.on('data', function(data) {
        console.log(data);
    })
});
request.end();


// //------------------------------------
// var $ = require('jquery');
// var request = require('request');
// var OAuth   = require('oauth-1.0a');
 
 


// var oauth = OAuth({
//     consumer: {
//         public: 'oueUNFo7JquoQkUZCyGCByADVQ1OEqwN3LI76UzqZbs2',
//         secret: '0SXgcxSCdK1rvhk8ziUWSuRl3flC1R23gzMCIR6T0pg0'
//     },
//     signature_method: 'HMAC-SHA1'
// });
  

// var request_data = {
//     url: 'https://api.tradeking.com/v1/market/ext/quotes.json?symbols=aapl',
//     method: 'GET'
// };

// var token = {
//     public: '4P6i4qbS1xaJSHjXtVx4CHjcQqkASex1pq8XUWIGkL86',
//     secret: 'lnktvF16Bb9obBYtuhHgMY44rIQds1FnJZGfqB9PuoU5'
// };
  
 
// request({
//     url: request_data.url,
//     method: request_data.method,
//     headers:   oauth.toHeader(oauth.authorize(request_data, token)) 
// }, function(error, data) {
//     window.console.log(error);
//        window.console.log(data);

    
       	 
// });
  
  
// make transferrable to other trading sites
// draw out flow chart and timing
// create a stock simulator going up and down by one cent.
// enter in my trade and create a switch statement that executes the opposite etc... buy cover 

    // var credentials = {
    //     consumer_key: "oueUNFo7JquoQkUZCyGCByADVQ1OEqwN3LI76UzqZbs2",
    //     consumer_secret: "0SXgcxSCdK1rvhk8ziUWSuRl3flC1R23gzMCIR6T0pg0",
    //     access_token: "4P6i4qbS1xaJSHjXtVx4CHjcQqkASex1pq8XUWIGkL86",
    //     access_secret: "lnktvF16Bb9obBYtuhHgMY44rIQds1FnJZGfqB9PuoU5"
    // };