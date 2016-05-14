(function(){

   

window.tkData = {};
$.getJSON("/json/tk-creds.json", function(data) {

    var creds = data;

    var oauth = OAuth({
        consumer: {
            public: creds.consumer_key,
            secret: creds.consumer_secret
        },
        signature_method: 'HMAC-SHA1'
    });
    var token = {
        public: creds.access_token,
        secret: creds.access_secret
    };
    var request_data = {
        url: 'https://api.tradeking.com/v1/market/ext/quotes.json?symbols=aapl',
        method: 'GET'
    };
    $.ajax({
        url: request_data.url,
        type: request_data.method,
        data: oauth.authorize(request_data, token)
    }).error(function(err) {
      
       window.console.log(err);
    }).done(function(data) {
      
   
        window.tkData = data;
    });
    
});

window.console.log(window.tkData);

})();

// make transferrable to other trading sites
// draw out flow chart and timing
// create a stock simulator going up and down by one cent.
// enter in my trade and create a switch statement that executes the opposite etc... buy cover