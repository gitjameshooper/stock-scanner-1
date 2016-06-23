// api limits 1 call per second
// https://developers.tradeking.com/documentation/market-ext-quotes-get-post
//  use this to pull stocks from finviz var arr = []; $('.screener-link-primary').each(function(){  var it = $(this).text(); arr.push(it); }); window.console.log(arr);
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_price_o1,ta_volatility_mo2&ft=4&o=-price
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_curvol_o750,sh_price_o1&ft=4&o=-price&r=121
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o200,sh_price_o1&ft=4&o=-price&r=181
// for volume cacluation based off time
// https://github.com/cdituri/node-tradeking  example for websocket
// https://investor.tradeking.com/Modules/Trading/defaultTrade.php
//https://openshift.redhat.com/app/console/applications
//http://jimhooper-stockscanner.rhcloud.com/

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
            [0, 350],
            [351, 700],
            [701, 1050],
            [1051, 1400],
            [1401, 1750],
            [1751, 2100],
            [2101, 2450],
            [2451, 2800]
        ],
        accountVal: 13000,
        dateHours: null,
        symbolsCurTier: 0,
        stockDiffPctA: 6,
        stockAwayPctA: 2,
        stockAwayPctB: 4, // price percentage away from vwap
        stockSpreadC: .10,
        stockFastC: .15, // price change 
        stockVolume: {
            "hr8": 150000,
            "hr9": 300000,
            "hr10": 600000,
            "hr11": 800000,
            "hr12": 1000000,
            "hr13": 1200000,
            "hr14": 1400000,
            "hr15": 1400000
        },

        soundCount: 0,
        apiMSecs: 900,
        run: true
    }

    $s.quotesData = {};
    // Stock Buckets
    $s.stocksA = [];
    $s.stocksB = [];
    $s.stocksC = [];
    $s.stocksCold = [];
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
                data: $s.cfg.tkOauth.authorize($s.cfg.tkRequestData, $s.cfg.tkToken),
                beforeSend: function(xhr, settings) {
                    // hijack request url and remove duplicate symbols from oAuth
                    var symbolStr = settings.url.indexOf('&symbols=');
                    var oauthStr = settings.url.indexOf('&oauth_signature=');
                    var rmString = settings.url.substring(symbolStr, oauthStr);
                    settings.url = settings.url.replace(rmString, '');
                }

            }).error(function(err) {
                $s.class = "error";
                $s.$apply();
                window.console.log("Bad TK Request", err);
                // after failed request try api again
                setTimeout(function() {
                    if ($s.cfg.run) {
                        $s.callApi();
                    }
                }, 3000);
            }).done(function(data) {

                $s.class = "green";
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
            var stockDiff = (stock.hi - stock.lo).toFixed(2),
                stockDiffPctA = (stockDiff / stock.lo).toFixed(3) * 100;

            if (stockDiffPctA >= $s.cfg.stockDiffPctA) {
                return true;
            }
        }
        //  test stock for pullback
    $s.hodTestA = function(stock) {
             
            var stockDiff = (stock.hi - stock.last).toFixed(2),
                stockDiffPctA = (stockDiff / stock.hi).toFixed(3) * 100;

            if (stockDiffPctA >= $s.cfg.stockAwayPctA) {
                return true;
            }
        }
        //  test stock if it is above vwap
    $s.vwapTestA = function(stock) {
        
        if (stock.last >= stock.vwap) {
            return true;
        }
    }

    /*  ALL B TESTS */
    // test if stock is far away from vwap
    // $s.vwapTestB = function(stock) {
    //         var stockVwap = Number(stock.vwap).toFixed(2),  
    //             stockPrice = Number(stock.last),
    //             stockDiffVwap = (stockVwap - stockPrice).toFixed(2),
    //             stockDiffPctVwapD = (stockDiffVwap / stockPrice).toFixed(3) * 100;
    //             stock.vwapDiff = stockDiffPctVwapD;
    //             stock.vwap = parseFloat(Math.round(stockVwap * 100) / 100).toFixed(2);

    //         if (stockDiffPctVwapD >= $s.cfg.stockAwayPctB) {
    //             return true;
    //         }
    //     }
    /*  ALL C TESTS */
    $s.spreadTestC = function(stock) {
        
            stock.spread = Number((stock.ask - stock.bid).toFixed(2));
        if (stock.spread <= $s.cfg.stockSpreadC) {
            return true;
        }
    }
    $s.moveTestC = function(stock) {
       
        $.each($s.stocksCold, function(key, value) {

            if (stock.symbol === $s.stocksCold[key].symbol) {

                stock.fast = Number(Math.abs(stock.last - $s.stocksCold[key].last).toFixed(2));

                if (stock.fast >= $s.cfg.stockFastC) {
                   
                    // check if stock is already in array
                    if(_.where($s.stocksD, {symbol: stock.symbol}).length == 0){
                        $s.stocksD.push(stock);
                    }
                }
            }
        });

    }


    /* Global Tests */
 
    $s.volumeTest = function(stock) {
    
        // if outside trading time use after 3/EOD volume
        if ($s.cfg.dateHours > 15 || $s.cfg.dateHours < 8) { $s.cfg.dateHours = 15; }
        if (stock.vl >= $s.cfg.stockVolume['hr' + $s.cfg.dateHours]) {
            return true;
        }
    }
    $s.formatStock = function(stock){
        stock.bid = Number(stock.bid);
        stock.vwap = Number(stock.vwap);
        stock.ask = Number(stock.ask);
        stock.lo = Number(stock.lo);
        stock.hi = Number(stock.hi);
        stock.vl = Number(stock.vl);
        stock.shares = Number(($s.cfg.accountVal / stock.last).toFixed(0) / 2);
        stock.last = Number(parseFloat(Math.round(stock.last * 100) / 100).toFixed(2));
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
    $s.removeStock = function(stock, stocksArr) {
        
        stocksArr.splice(stocksArr.indexOf(stock),1);
        
        
    }
     $s.removeAll = function(stocksArr) {
         
        stocksArr.length = 0;
        
    }
    $s.quoteScan = function() {

        $.each($s.quotesData, function(key, stock) {

            // format stock values
            $s.formatStock(stock);

            // run all stocks thru the volume test
            if ($s.volumeTest(stock)) {

                // check if the stock passes all the A Tests
                if ($s.lodTestA(stock) && $s.hodTestA(stock) && $s.vwapTestA(stock)) {
                   $s.stocksA.push(stock);
                }

                // check if the stock passes all the B Tests
                // if ($s.vwapTestB(stock)) {
                //     stock.vl = Number(stock.vl);
                //     $s.stocksB.push(stock);
                // }
                // check if the stock passes all the C Tests
                if ($s.spreadTestC(stock)) {
                    $s.stocksC.push(stock);

                    if ($s.stocksCold.length > 1) {

                        $s.moveTestC(stock);

                    }
                }

            }
        });

        // empty array after going thru all tiers

        if ($s.cfg.symbolsCurTier === 0) {

            // play sound if vwamp stock found
            // if ($s.stocksD.length != $s.cfg.soundCount) {
            //     $.playSound("http://www.noiseaddicts.com/samples_1w72b820/3739");
            //     $s.cfg.soundCount = $s.stocksD.length;
            // }
            
            $s.$apply();
            $s.stocksA = [];
            $s.stocksCold = $s.stocksC;
            $s.stocksC = [];
            // $s.stocksD = _.uniq($s.stocksD, 'symbol');
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