// api limits  250 stocks per call per second
//  use this to pull stocks from finviz var arr = []; $('.screener-link-primary').each(function(){  var it = $(this).text(); arr.push(it); }); window.console.log(arr);
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_price_o1,ta_volatility_mo2&ft=4&o=-price
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_curvol_o750,sh_price_o1&ft=4&o=-price&r=121
var myApp = angular.module('stockScannerApp', []);

myApp.controller('stockController', ['$scope', function($scope) {
    var $s = $scope;
    // config
    $s.cfg = {
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
        stockAwayPctVD: 2,  // price away from vwap
        stockVolume: 100000,
        soundCount: 0,
        run: true

    }

    $s.quotesData = {};
    $s.stocksABCD = [];
    $s.stocksVWAP = [];
    $s.stocksVWAPD = [];

    // format symbols form json into string
    $s.formatSymbols = function() {
            if ($s.cfg.run) {
                $s.cfg.symbolStr = '';
                $s.cfg.symbolsBegCount = 0;
                $.getJSON($s.cfg.symbolsJSON, function(data) {

                    $.each(data.symbols, function(k, v) {

                        if ($s.cfg.symbolsBegCount >= $s.cfg.symbolsTiers[$s.cfg.symbolsCurTier][0] && $s.cfg.symbolsTiers[$s.cfg.symbolsCurTier][0] <= $s.cfg.symbolsCurCount && $s.cfg.symbolsCurCount <= $s.cfg.symbolsTiers[$s.cfg.symbolsCurTier][1]) {
                            $s.cfg.symbolStr += v + ',';
                            $s.cfg.symbolsCurCount++;

                        }
                        $s.cfg.symbolsBegCount++;
                    });

                    $s.cfg.symbolsCurTier++;

                    if ($s.cfg.symbolsCurTier >= $s.cfg.symbolsTiers.length) {
                        $s.cfg.symbolsCurTier = 0;
                        $s.cfg.symbolsCurCount = 0;
                    };
                    $s.cfg.symbolStr = $s.cfg.symbolStr.slice(0, -1);
                    setTimeout(function() {
                        $s.callApi();
                    }, 500);

                });
            }
        }
        // Call tradeking api
    $s.callApi = function() {
            $.getJSON($s.cfg.tkCredsJSON, function(data) {

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
                    url: $s.cfg.tkApiUrl + $s.cfg.symbolStr,
                    method: 'GET'
                };
                $.ajax({
                    url: request_data.url,
                    type: request_data.method,
                    data: oauth.authorize(request_data, token)
                }).error(function(err) {
                    $s.class = "error";
                    $s.cfg.run = false;
                    window.console.log("Bad TK Request", err);
                }).done(function(data) {

                    $s.quotesData = data.response.quotes.quote;
                    $s.quoteScan();
                });

            });
        }
        //  test stock for first move up
    $s.lodTestA = function(stock) {
            var stockLo = Number(stock.lo),
                stockHi = Number(stock.hi),
                stockDiff = (stockHi - stockLo).toFixed(2),
                stockDiffPctA = (stockDiff / stockLo).toFixed(3) * 100;

            if (stockDiffPctA >= $s.cfg.stockDiffPctA) {
                return true;
            }
        }
        //  test stock if it is above vwap
    $s.vwapTestA = function(stock) {
            var stockVwap = Number(stock.vwap),
                stockPrice = Number(stock.last);

            if (stockPrice >= stockVwap) {
                return true;
            }
        }
        //  test stock for pullback
    $s.hodTestA = function(stock) {
            var stockHi = Number(stock.hi),
                stockPrice = Number(stock.last),
                stockDiff = (stockHi - stockPrice).toFixed(2),
                stockDiffPctA = (stockDiff / stockHi).toFixed(3) * 100;
            if (stockDiffPctA >= $s.cfg.stockAwayPctA) {
                return true;
            }
        }
        // $s.lodTestV = function(stock) {
        //         var stockLo = Number(stock.lo),
        //             stockHi = Number(stock.hi),
        //             stockDiff = (stockHi - stockLo).toFixed(2),
        //             stockDiffPctV = (stockDiff / stockLo).toFixed(3) * 100;

    //         if (stockDiffPctV >= $s.cfg.stockDiffPctV) {
    //             return true;
    //         }
    //     }
    // $s.vwapTestV = function(stock) {
    //         var stockVwap = Number(stock.vwap),
    //             stockPrice = Number(stock.last),
    //             stockDiffVwap = (stockPrice - stockVwap).toFixed(2),
    //             stockDiffPctVwapV = (stockDiffVwap / stockPrice).toFixed(3) * 100;

    //         if (Math.abs(stockDiffPctVwapV) <= $s.cfg.stockAwayPctV) {
    //             return true;
    //         }
    //     }
    $s.vwapTestVD = function(stock) {
        var stockVwap = Number(stock.vwap),
            stockPrice = Number(stock.last),
            stockDiffVwap = (stockVwap - stockPrice).toFixed(2),
            stockDiffPctVwapVD = (stockDiffVwap / stockPrice).toFixed(3) * 100;

        if (stockDiffPctVwapVD >= $s.cfg.stockAwayPctVD) {
            return true;
        }
    }
    $s.volumeTest = function(stock) {
        var stockVolume = Number(stock.vl);

        if (stockVolume >= $s.cfg.stockVolume) {
            return true;
        }
    }
    $s.initSound = function() {

        $.extend({
            playSound: function() {
                return $(
                    '<audio autoplay="autoplay" style="display:none;">' + '<source src="' + arguments[0] + '.mp3" />' + '<source src="' + arguments[0] + '.ogg" />' + '<embed src="' + arguments[0] + '.mp3" hidden="true" autostart="true" loop="false" class="playSound" />' + '</audio>'
                ).appendTo('body');
            }
        });
    }
    $s.quoteScan = function() {

        $.each($s.quotesData, function(key, stock) {

            // check if the stock passes the ABCD tests
            if ($s.volumeTest(stock) && $s.lodTestA(stock) && $s.hodTestA(stock) && $s.vwapTestA(stock)) {
                $s.stocksABCD.push(stock);
            }
            // check if the stock passes the VWAP tests
            // if ($s.volumeTest(stock) && $s.lodTestV(stock) && $s.vwapTestV(stock)) {
            //     $s.stocksVWAP.push(stock);
            // }
            // check if the stock passes the VWAP tests
            if ($s.volumeTest(stock) && $s.vwapTestVD(stock)) {
                $s.stocksVWAPD.push(stock);


            }
        });

        // empty array after going thru all tiers

        if ($s.cfg.symbolsCurTier === 0) {
            // play sound if vwamp stock found
             if ($s.stocksVWAPD.length && ($s.stocksVWAPD.length !== $s.cfg.soundCount)) {
                // $.playSound("http://www.noiseaddicts.com/samples_1w72b820/3739");
                $s.cfg.soundCount = $s.stocksVWAPD.length;
            }
            $s.$apply();
            $s.stocksABCD = [];
            $s.stocksVWAP = [];
            $s.stocksVWAPD = [];

        }
        $s.formatSymbols();
    }
    $s.startScan = function() {
        $s.cfg.run = true;
        $s.formatSymbols();
        $s.initSound();
        $s.class = "green";
    }
    $s.stopScan = function() {
        $s.cfg.run = false;
        $s.class = "red";
    }

}]);