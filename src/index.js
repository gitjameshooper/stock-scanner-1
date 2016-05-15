 var stockScanner = (function() {
     var config = {
         tkCredsJSON: "/json/tk-creds.json",
         tkApiUrl: "https://api.tradeking.com/v1/market/ext/quotes.json?symbols=",
         symbolsJSON: "/json/symbols.json",
         symbolStr: "",
         symbolsPerCall: 250,
         testQuotes: "/json/quotes.json",
         stockDiffPct: 5,
         stockAwayPct: 3

     }

     var quotesData = {};
     var stocksTrade = [];

     // format symbols into string
     var formatSymbols = function() {
             $.getJSON(config.symbolsJSON, function(data) {

                 $.each(data.symbols, function(k, v) {
                     config.symbolStr += v + ',';
                 });
                 config.symbolStr = config.symbolStr.slice(0, -1);
                 callApi();  
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
                 url: config.tkApiUrl + config.symbolStr,
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
                 quoteScan();
             });

         });
     }
     //  test stock for first move up
     var lodTest = function(stock) {
         var stockLo = Number(stock.lo),
             stockHi = Number(stock.hi),
             stockDiff = (stockHi - stockLo).toFixed(2),
             stockDiffPct = (stockDiff / stockLo).toFixed(3)*100;
    
         if (stockDiffPct >= config.stockDiffPct) {        
             return true;
         }

     }
       //  test stock if it is above vwap
     var vwapTest = function(stock) {
         var stockVwap = Number(stock.vwap),
             stockPrice = Number(stock.last);
    
         if (stockPrice >= stockVwap) {        
             return true;
         }

     }
     //  test stock for first move up
     var hodTest = function(stock) {
         var stockHi = Number(stock.hi),
             stockPrice = Number(stock.last),
             stockDiff = (stockHi - stockPrice).toFixed(2),
             stockDiffPct = (stockDiff / stockHi).toFixed(3)*100;
         if (stockDiffPct >= config.stockDiffPct) {        
             return true;
         }

     }
     var quoteScan = function() {

             $.each(quotesData, function(key, stock) {
                 window.console.log(stock);
                 if(stock.)
                 if (hodTest(stock) && lodTest(stock) && vwapTest(stock)) {
                     stocksTrade.push(stock);
                 }
             });
             window.console.log(stocksTrade);
         }


     return {
         init: function() {
             formatSymbols();
             


         }
     };

 })();
// var arr = []; $('.screener-link-primary').each(function(){  var it = $(this).text(); arr.push(it); }); window.console.log(arr);
 stockScanner.init();