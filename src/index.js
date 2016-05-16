// api limits  250 stocks per call per second
var stockScanner = (function() {
    var config = {
        tkCredsJSON: "/json/tk-creds.json",
        tkApiUrl: "https://api.tradeking.com/v1/market/ext/quotes.json?symbols=",
        symbolsJSON: "/json/symbols.json",
        symbolStr: "",
        symbolsCurCount: 0,
        symbolsBegCount: 0,
        symbolsTiers: [
            [0, 150],
            [151, 300],
            [301, 450],
            [451, 600],
            [601, 750],
            [751, 900]
        ],
        symbolsCurTier: 0,
        stockDiffPct: 5,
        stockAwayPct: 3,
        run: true

    }

    var quotesData = {};
    var stocksTrade = [];

    // format symbols into string
    var formatSymbols = function() {
            if (config.run) {
                config.symbolStr = '';
                config.symbolsBegCount = 0;
                $.getJSON(config.symbolsJSON, function(data) {
                    window.console.log(config.symbolsCurCount);
                    $.each(data.symbols, function(k, v) {

                        if (config.symbolsBegCount >= config.symbolsTiers[config.symbolsCurTier][0] && config.symbolsTiers[config.symbolsCurTier][0] <= config.symbolsCurCount && config.symbolsCurCount <= config.symbolsTiers[config.symbolsCurTier][1]) {
                            config.symbolStr += v + ',';
                            config.symbolsCurCount++;

                        }
                        config.symbolsBegCount++;
                    });

                    config.symbolsCurTier++;

                    if (config.symbolsCurTier >= config.symbolsTiers.length) {
                        config.symbolsCurTier = 0;
                        config.symbolsCurCount = 0;
                    };
                    config.symbolStr = config.symbolStr.slice(0, -1);
                    callApi();
                });
            }
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

                    quotesData = data.response.quotes.quote;
                    quoteScan();
                });

            });
        }
        //  test stock for first move up
    var lodTest = function(stock) {
            var stockLo = Number(stock.lo),
                stockHi = Number(stock.hi),
                stockDiff = (stockHi - stockLo).toFixed(2),
                stockDiffPct = (stockDiff / stockLo).toFixed(3) * 100;

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
            stockDiffPct = (stockDiff / stockHi).toFixed(3) * 100;
        if (stockDiffPct >= config.stockDiffPct) {
            return true;
        }

    }
    var quoteScan = function() {

        $.each(quotesData, function(key, stock) {

              // check if the stock passes the tests
            if (lodTest(stock) && hodTest(stock) && vwapTest(stock)) {

                
                    stocksTrade.push(stock);
                
            }
        });
          // empty array after going thru all tiers
        if (config.symbolsCurTier === 0) {
           stocksTrade = [];
        }

        
        formatSymbols();

    }


    return {
        startScan: function() {
            config.run = true;
            formatSymbols();

        },
        stopScan: function() {
            config.run = false;
        },
        stocksScanned: function() {
            return stocksTrade;
        }
    };

})();
// var arr = []; $('.screener-link-primary').each(function(){  var it = $(this).text(); arr.push(it); }); window.console.log(arr);




var myApp = angular.module('stockScannerApp', []);

myApp.controller('stockController', ['$scope', function($scope) {
    
    $scope.$watch('stocks', function(){
            alert('hey, myVar has changed!');
    });
    
    
    $scope.startScan = function() { stockScanner.startScan(); $scope.class = "green"; $scope.stocks = stockScanner.stocksScanned(); }
    $scope.stopScan = function() { stockScanner.stopScan(); $scope.class = "red"; }
}]);