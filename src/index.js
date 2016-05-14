 var stockScanner = (function() {
     var config = {
         tkCredsJSON: "/json/tk-creds.json",
         tkApiUrl :  "https://api.tradeking.com/v1/market/ext/quotes.json?symbols=aapl,fb,acc",
         symbolsJSON : "/json/symbols.json",
     }

     var quotesData = {};

     var formatSymbols = function(){
        $.getJSON(config.symbolsJSON, function(data) {
            
            $.each(data.symbols, function(k, v){

                    window.console.log(v.symbol);
            });
            

        });
     }
     // Call tradeking api
     var callApi = function() {
         $.getJSON(config.tkCredsJSON, function(data) {

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
                 url: config.tkApiUrl,
                 method: 'GET'
             };
             $.ajax({
                 url: request_data.url,
                 type: request_data.method,
                 data: oauth.authorize(request_data, token)
             }).error(function(err) {

                 window.console.log("Bad TK Request", err);
             }).done(function(data) {

                 quotesData = data;
             });

         });
     }

     return {
         init: function() {
                formatSymbols();
             // callApi();

         }
     };

 })();

 stockScanner.init(); 