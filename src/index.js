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
        tkCredsJSONUrl: "/json/tk-creds.json",
        tkOauth: {},
        tkToken: {},
        tkRequestData: {},
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
        dateHours: null,
        symbolsCurTier: 0,
        stockDiffPctA: 5,
        stockAwayPctA: 2,
        stockAwayPctB: 4, // price away from vwap
        stockBeta: 2,
        stockVolume: {
            "hr9" :  50000,
            "hr10" : 200000,
            "hr11" : 500000,
            "hr12" : 800000,
            "hr13" : 1000000,
            "hr14" : 1200000,
            "hr15" : 1200000
        },

        soundCount: 0,
        apiMSecs: 1000,
        run: true
    }

    $s.quotesData = {};
    $s.stocksA = [];
    $s.stocksB = [];
    $s.stocksC = [];
    $s.stocksD = [];

    // get both json data and tkcreds
    $s.initData = function() {

            var xhr1 = $.getJSON($s.cfg.symbolsJSONUrl, function(data) {
                $s.cfg.symbolsJSON = data.symbols;

            }).fail(function(err) {
                window.console.log(err.responseText);
                $s.class = "error";
                $s.$apply();
            });
            var xhr2 = $.getJSON($s.cfg.tkCredsJSONUrl, function(data) {

                var creds = data;

                $s.cfg.tkOauth = OAuth({
                    consumer: {
                        public: creds.consumer_key,
                        secret: creds.consumer_secret
                    },
                    signature_method: 'HMAC-SHA1'
                });
                $s.cfg.tkToken = {
                    public: creds.access_token,
                    secret: creds.access_secret
                };
                $s.cfg.tkRequestData = {
                    url: $s.cfg.tkApiUrl,
                    method: 'GET'
                };
            }).fail(function(err) {
                window.console.log(err.responseText);
                $s.class = "error";
                $s.$apply();
                  
            });
            $.when(xhr1, xhr2).done(function(xhr1, xhr2) {
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
                $s.cfg.tkRequestData.url = $s.cfg.tkApiUrl + $s.cfg.symbolStr;
                setTimeout(function() {
                    $s.callApi();
                }, $s.cfg.apiMSecs);
            }
        }
        // Call tradeking api
    $s.callApi = function() {
            
            $.ajax({
                url: $s.cfg.tkRequestData.url,
                type: $s.cfg.tkRequestData.method,
                data: $s.cfg.tkOauth.authorize($s.cfg.tkRequestData, $s.cfg.tkToken)
            }).error(function(err) {
                $s.class = "error";
                $s.$apply();
                window.console.log("Bad TK Request", err);
                setTimeout(function() {
                    if($s.cfg.run){
                         $s.callApi();
                    }
                }, 3000);
            }).done(function(data) {
                // set date var
                $s.cfg.dateHours = new Date().getHours();
                //run tk data thru tests
                $s.quotesData = data.response.quotes.quote;
                $s.quoteScan();
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
        if (stockVolume >= $s.cfg.stockVolume['hr'+$s.cfg.dateHours]) {
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
            if ($s.volumeTest(stock) && $s.betaTestD(stock) ) {
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
        $s.initData();
        $s.class = "green";
    }
    $s.stopScan = function() {
        $s.cfg.run = false;
        $s.class = "red";
    }

}]);