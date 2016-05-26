// api limits  250 stocks per call per second
// https://developers.tradeking.com/documentation/market-ext-quotes-get-post
//  use this to pull stocks from finviz var arr = []; $('.screener-link-primary').each(function(){  var it = $(this).text(); arr.push(it); }); window.console.log(arr);
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_price_o1,ta_volatility_mo2&ft=4&o=-price
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_curvol_o750,sh_price_o1&ft=4&o=-price&r=121
// for volume cacluation based off time

var myApp = angular.module('stockScannerApp', []);

myApp.controller('stockController', ['$scope', function($scope) {
    var $s = $scope;
    // config
    $s.cfg = {
        tkCredsJSON: "/json/tk-creds.json",
        tkApiUrl: "https://api.tradeking.com/v1/market/ext/quotes.json?symbols=",
        symbolsJSONUrl: "/json/symbols.json",
        symbolsJSON: {},
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
        stockDiffPctA: 4,
        stockAwayPctA: 2,
        stockAwayPctB: 2, // price away from vwap
        stockBeta: 2,
        stockVolume: [50000, 500000],
        soundCount: 0,
        run: true
    }

    $s.quotesData = {};
    $s.stocksA = [];
    $s.stocksB = [];
    $s.stocksC = [];
    $s.stocksD = [];

    // get all symbolStr
    $s.jsonSymbols = function() {

            $.getJSON($s.cfg.symbolsJSONUrl, function(data) {
                $s.cfg.symbolsJSON = data.symbols;

            }).done(function() {

                $s.formatSymbols();
            });

        }
        // format symbols form json into string
    $s.formatSymbols = function() {
            if ($s.cfg.run) {
                $s.cfg.symbolStr = '';
                $s.cfg.symbolsBegCount = 0;

                $.each($s.cfg.symbolsJSON, function(k, v) {

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
                }, 1500);
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
                    $s.$apply();
                    window.console.log("Bad TK Request", err);
                    setTimeout(function() {
                        $s.callApi();
                    }, 3000);
                }).done(function(data) {

                    $s.quotesData = data.response.quotes.quote;
                    $s.quoteScan();
                });

            });
        }
        /*  ALL A TESTS */
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
        //  test stock if it is above vwap
    $s.vwapTestA = function(stock) {
        var stockVwap = Number(stock.vwap),
            stockPrice = Number(stock.last);

        if (stockPrice >= stockVwap) {
            return true;
        }
    }

    /*  ALL B TESTS */
    // test if stock is far away from vwap
    $s.vwapTestB = function(stock) {
            var stockVwap = Number(stock.vwap),
                stockPrice = Number(stock.last),
                stockDiffVwap = (stockVwap - stockPrice).toFixed(2),
                stockDiffPctVwapD = (stockDiffVwap / stockPrice).toFixed(3) * 100;

            if (stockDiffPctVwapD >= $s.cfg.stockAwayPctB) {
                return true;
            }
        }
        /*  ALL C TESTS */
        // test stock below vwap
    $s.vwapTestC = function(stock) {
            var stockVwap = Number(stock.vwap),
                stockPrice = Number(stock.last);

            if (stockPrice <= stockVwap) {
                return true;
            }
        }
        // test stock above yesterday's close
    $s.closeTestC = function(stock) {
            var stockClose = Number(stock.cl),
                stockPrice = Number(stock.last);

            if (stockPrice >= stockClose) {
                return true;
            }
        }
        /*  ALL D TESTS */
        // test volatility of stock compared to market
    $s.betaTestD = function(stock) {
            var stockBeta = Number(stock.beta);

            if (stockBeta >= $s.cfg.stockBeta) {
                return true;
            }
        }
        // test if stock is away from vwap
    $s.vwapTestD = function(stock) {
        var stockVwap = Number(stock.vwap),
            stockPrice = Number(stock.last),
            stockDiffVwap = (stockVwap - stockPrice).toFixed(2),
            stockDiffPctVwapD = (stockDiffVwap / stockPrice).toFixed(3) * 100;

        if (stockDiffPctVwapD >= $s.cfg.stockAwayPctB) {
            return true;
        }
    }

    /* Global Tests */
    $s.volumeTest = function(stock) {
        var stockVolume = Number(stock.vl);
        var num = new Date().getHours() >= 13 ? 1 : 0;

        if (stockVolume >= $s.cfg.stockVolume[num]) {
            return true;
        }
    }
    $s.helperFuncs = function() {
        // play sound when new stocks are found
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

            // check if the stock passes all the A Tests
            if ($s.volumeTest(stock) && $s.lodTestA(stock) && $s.hodTestA(stock) && $s.vwapTestA(stock)) {
                stock.vl = Number(stock.vl);
                stock.last = Number(stock.last);
                $s.stocksA.push(stock);
            }

            // check if the stock passes all the B Tests
            if ($s.volumeTest(stock) && $s.vwapTestB(stock)) {
                stock.vl = Number(stock.vl);
                stock.last = Number(stock.last);
                $s.stocksB.push(stock);
            }
            // check if the stock passes all the C Tests
            if ($s.volumeTest(stock) && $s.vwapTestC(stock) && $s.closeTestC(stock)) {
                stock.vl = Number(stock.vl);
                stock.last = Number(stock.last);
                $s.stocksC.push(stock);
            }
            // check if the stock passes all the D Tests
            if ($s.volumeTest(stock) && $s.betaTestD(stock) && $s.vwapTestD(stock)) {
                stock.beta = Number(stock.beta);
                stock.last = Number(stock.last);
                $s.stocksD.push(stock);
            }
        });

        // empty array after going thru all tiers

        if ($s.cfg.symbolsCurTier === 0) {
            // play sound if vwamp stock found
            if ($s.stocksB.length && ($s.stocksB.length !== $s.cfg.soundCount)) {
                // $.playSound("http://www.noiseaddicts.com/samples_1w72b820/3739");
                $s.cfg.soundCount = $s.stocksB.length;
            }

            $s.$apply();
            $s.stocksA = [];
            $s.stocksB = [];
            $s.stocksC = [];
            $s.stocksD = [];

        }
        //  Create loop
        $s.formatSymbols();
    }
    $s.startScan = function() {
        $s.cfg.run = true;
        $s.helperFuncs();
        $s.jsonSymbols();
        $s.class = "green";
    }
    $s.stopScan = function() {
        $s.cfg.run = false;
        $s.class = "red";
    }

}]);