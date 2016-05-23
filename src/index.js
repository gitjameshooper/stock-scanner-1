// api limits  250 stocks per call per second
//  use this to pull stocks from finviz var arr = []; $('.screener-link-primary').each(function(){  var it = $(this).text(); arr.push(it); }); window.console.log(arr);
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_price_o1,ta_volatility_mo2&ft=4&o=-price
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_curvol_o750,sh_price_o1&ft=4&o=-price&r=121
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
            [751, 900],
            [901, 1050]
        ],
        symbolsCurTier: 0,
        stockDiffPctA: 5,
        stockAwayPctA: 2,
        stockDiffPctV: 8,
        stockAwayPctV: 2,
        stockAwayPctVD: 3,  // price away from vwap
        stockVolume: 100000,
        soundCount: 0,
        run: true

    }

    $scope.quotesData = {};
    $scope.stocksABCD = [];
    $scope.stocksVWAP = [];
    $scope.stocksVWAPD = [];

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
                    setTimeout(function() {
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
                    $scope.config.run = false;
                    window.console.log("Bad TK Request", err);
                }).done(function(data) {

                    $scope.quotesData = data.response.quotes.quote;
                    $scope.quoteScan();
                });

            });
        }
        //  test stock for first move up
    $scope.lodTestA = function(stock) {
            var stockLo = Number(stock.lo),
                stockHi = Number(stock.hi),
                stockDiff = (stockHi - stockLo).toFixed(2),
                stockDiffPctA = (stockDiff / stockLo).toFixed(3) * 100;

            if (stockDiffPctA >= $scope.config.stockDiffPctA) {
                return true;
            }
        }
        //  test stock if it is above vwap
    $scope.vwapTestA = function(stock) {
            var stockVwap = Number(stock.vwap),
                stockPrice = Number(stock.last);

            if (stockPrice >= stockVwap) {
                return true;
            }
        }
        //  test stock for pullback
    $scope.hodTestA = function(stock) {
            var stockHi = Number(stock.hi),
                stockPrice = Number(stock.last),
                stockDiff = (stockHi - stockPrice).toFixed(2),
                stockDiffPctA = (stockDiff / stockHi).toFixed(3) * 100;
            if (stockDiffPctA >= $scope.config.stockAwayPctA) {
                return true;
            }
        }
        // $scope.lodTestV = function(stock) {
        //         var stockLo = Number(stock.lo),
        //             stockHi = Number(stock.hi),
        //             stockDiff = (stockHi - stockLo).toFixed(2),
        //             stockDiffPctV = (stockDiff / stockLo).toFixed(3) * 100;

    //         if (stockDiffPctV >= $scope.config.stockDiffPctV) {
    //             return true;
    //         }
    //     }
    // $scope.vwapTestV = function(stock) {
    //         var stockVwap = Number(stock.vwap),
    //             stockPrice = Number(stock.last),
    //             stockDiffVwap = (stockPrice - stockVwap).toFixed(2),
    //             stockDiffPctVwapV = (stockDiffVwap / stockPrice).toFixed(3) * 100;

    //         if (Math.abs(stockDiffPctVwapV) <= $scope.config.stockAwayPctV) {
    //             return true;
    //         }
    //     }
    $scope.vwapTestVD = function(stock) {
        var stockVwap = Number(stock.vwap),
            stockPrice = Number(stock.last),
            stockDiffVwap = (stockVwap - stockPrice).toFixed(2),
            stockDiffPctVwapVD = (stockDiffVwap / stockPrice).toFixed(3) * 100;

        if (stockDiffPctVwapVD >= $scope.config.stockAwayPctVD) {
            return true;
        }
    }
    $scope.volumeTest = function(stock) {
        var stockVolume = Number(stock.vl);

        if (stockVolume >= $scope.config.stockVolume) {
            return true;
        }
    }
    $scope.initSound = function() {

        $.extend({
            playSound: function() {
                return $(
                    '<audio autoplay="autoplay" style="display:none;">' + '<source src="' + arguments[0] + '.mp3" />' + '<source src="' + arguments[0] + '.ogg" />' + '<embed src="' + arguments[0] + '.mp3" hidden="true" autostart="true" loop="false" class="playSound" />' + '</audio>'
                ).appendTo('body');
            }
        });
    }
    $scope.quoteScan = function() {

        $.each($scope.quotesData, function(key, stock) {

            // check if the stock passes the ABCD tests
            if ($scope.volumeTest(stock) && $scope.lodTestA(stock) && $scope.hodTestA(stock) && $scope.vwapTestA(stock)) {
                $scope.stocksABCD.push(stock);
            }
            // check if the stock passes the VWAP tests
            // if ($scope.volumeTest(stock) && $scope.lodTestV(stock) && $scope.vwapTestV(stock)) {
            //     $scope.stocksVWAP.push(stock);
            // }
            // check if the stock passes the VWAP tests
            if ($scope.volumeTest(stock) && $scope.vwapTestVD(stock)) {
                $scope.stocksVWAPD.push(stock);


            }
        });

        // empty array after going thru all tiers

        if ($scope.config.symbolsCurTier === 0) {
            // play sound if vwamp stock found
             if ($scope.stocksVWAPD.length && ($scope.stocksVWAPD.length !== $scope.config.soundCount)) {
                $.playSound("http://www.noiseaddicts.com/samples_1w72b820/3739");
                $scope.config.soundCount = $scope.stocksVWAPD.length;
            }
            $scope.$apply();
            $scope.stocksABCD = [];
            $scope.stocksVWAP = [];
            $scope.stocksVWAPD = [];

        }
        $scope.formatSymbols();
    }
    $scope.startScan = function() {
        $scope.config.run = true;
        $scope.formatSymbols();
        $scope.initSound();
        $scope.class = "green";
    }
    $scope.stopScan = function() {
        $scope.config.run = false;
        $scope.class = "red";
    }

}]);