// api limits  250 stocks per call per second
//  use this to pull stocks from finviz var arr = []; $('.screener-link-primary').each(function(){  var it = $(this).text(); arr.push(it); }); window.console.log(arr);
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_price_o1,ta_volatility_mo2&ft=4&o=-price
 
var myApp = angular.module('stockScannerApp', []);


myApp.controller('stockController', ['$scope', function($scope) {
     $scope.config = {
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
        stockDiffPct: 4,
        stockAwayPct: 2,
        run: true

    }

    $scope.quotesData = {};
    $scope.stockstoTrade = [];

    // format symbols into string
    $scope.formatSymbols = function() {
            if ($scope.config.run) {
                $scope.config.symbolStr = '';
                $scope.config.symbolsBegCount = 0;
                $.getJSON($scope.config.symbolsJSON, function(data) {

                    $.each(data.symbols, function(k, v) {

                        if ($scope.config.symbolsBegCount >= $scope.config.symbolsTiers[$scope.config.symbolsCurTier][0] && $scope.config.symbolsTiers[$scope.config.symbolsCurTier][0] <= $scope.config.symbolsCurCount && $scope.config.symbolsCurCount <= $scope.config.symbolsTiers[$scope.config.symbolsCurTier][1]) {
                            $scope.config.symbolStr += v + ',';
                            $scope.config.symbolsCurCount++;

                        }
                        $scope.config.symbolsBegCount++;
                    });

                    $scope.config.symbolsCurTier++;

                    if ($scope.config.symbolsCurTier >= $scope.config.symbolsTiers.length) {
                        $scope.config.symbolsCurTier = 0;
                        $scope.config.symbolsCurCount = 0;
                    };
                    $scope.config.symbolStr = $scope.config.symbolStr.slice(0, -1);
                    setTimeout(function(){
                            $scope.callApi();
                    }, 500);
                    
                });
            }
        }
        // Call tradeking api
    $scope.callApi = function() {
            $.getJSON($scope.config.tkCredsJSON, function(data) {

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
                    url: $scope.config.tkApiUrl + $scope.config.symbolStr,
                    method: 'GET'
                };
                $.ajax({
                    url: request_data.url,
                    type: request_data.method,
                    data: oauth.authorize(request_data, token)
                }).error(function(err) {
                    $scope.class = "error";
                    window.console.log("Bad TK Request", err);
                }).done(function(data) {

                    $scope.quotesData = data.response.quotes.quote;
                    $scope.quoteScan();
                });

            });
        }
        //  test stock for first move up
    $scope.lodTest = function(stock) {
            var stockLo = Number(stock.lo),
                stockHi = Number(stock.hi),
                stockDiff = (stockHi - stockLo).toFixed(2),
                stockDiffPct = (stockDiff / stockLo).toFixed(3) * 100;

            if (stockDiffPct >= $scope.config.stockDiffPct) {
                return true;
            }
        }
        //  test stock if it is above vwap
    $scope.vwapTest = function(stock) {
            var stockVwap = Number(stock.vwap),
                stockPrice = Number(stock.last);

            if (stockPrice >= stockVwap) {
                return true;
            }
        }
        //  test stock for first move up
    $scope.hodTest = function(stock) {
        var stockHi = Number(stock.hi),
            stockPrice = Number(stock.last),
            stockDiff = (stockHi - stockPrice).toFixed(2),
            stockDiffPct = (stockDiff / stockHi).toFixed(3) * 100;
        if (stockDiffPct >= $scope.config.stockDiffPct) {
            return true;
        }
    }
    $scope.quoteScan = function() {

        $.each($scope.quotesData, function(key, stock) {

            // check if the stock passes the tests
            if ($scope.lodTest(stock) && $scope.hodTest(stock) && $scope.vwapTest(stock)) {
                $scope.stockstoTrade.push(stock);
            }
        });
        // empty array after going thru all tiers
        
        if ($scope.config.symbolsCurTier === 0) {
             $scope.$apply();
             $scope.stockstoTrade = [];
               
        }
        $scope.formatSymbols();
    }
    $scope.startScan = function() {
        $scope.config.run = true;
        $scope.formatSymbols();
        $scope.class = "green";
    }
    $scope.stopScan = function() {
        $scope.config.run = false;
        $scope.class = "red";
    }

}]);