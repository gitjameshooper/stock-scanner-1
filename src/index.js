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
(function() {
    'use strict';

    angular
        .module('stockScannerApp', [])
        .controller('stockController', stockController);
    stockController.$inject = ['$scope'];

    function stockController($scope) {
        var vm = this;
        // config
        vm.cfg = {
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
            stockRangePctB: 2, // price percentage range
            stockAwayPctB: .5, // price percentage away midpoint
            stockSpreadC: .10,
            stockFastC: 1.5, // price percentage change 
            stockVolume: {
                "hr8": 300000,
                "hr9": 500000,
                "hr10": 800000,
                "hr11": 1000000,
                "hr12": 1200000,
                "hr13": 1400000,
                "hr14": 1600000,
                "hr15": 1600000
            },

            soundCount: 0,
            apiMSecs: 900,
            run: true
        }

        vm.quotesData = {};
        // Stock Buckets
        vm.stocksA = [];
        vm.stocksB = [];
        vm.stocksC = [];
        vm.stocksCold = [];
        vm.stocksCfin = [];

        vm.initData = initData;
        vm.formatSymbols = formatSymbols;
        vm.callApi = callApi;
        vm.lodTestA = lodTestA;
        vm.hodTestA = hodTestA;
        vm.vwapTestA = vwapTestA;
        vm.vwapTestB = vwapTestB;
        vm.rangeTestB = rangeTestB;
        vm.betweenTestB = betweenTestB;
        vm.spreadTestC = spreadTestC;
        vm.moveTestC = moveTestC;
        vm.volumeTest = volumeTest;
        vm.evenTest = evenTest;
        vm.formatStock = formatStock;
        vm.helperFuncs = helperFuncs;
        vm.removeStock = removeStock;
        vm.removeAll = removeAll;
        vm.quoteScan = quoteScan;
        vm.startScan = startScan;
        vm.stopScan = stopScan;

        // get both json data and tkcreds
        function initData() {

            var xhr1 = $.getJSON(vm.cfg.symbolsJSONUrl, function(data) {
                vm.cfg.symbolsJSON = data.symbols;

            }).fail(function(err) {
                window.console.log(err.responseText);
                vm.class = "error";
                $scope.$apply();
            });
            var xhr2 = $.getJSON(vm.cfg.tkCredsJSONUrl, function(data) {

                var creds = data;

                vm.cfg.tkOauth = OAuth({
                    consumer: {
                        public: creds.consumer_key,
                        secret: creds.consumer_secret
                    },
                    signature_method: 'HMAC-SHA1'
                });
                vm.cfg.tkToken = {
                    public: creds.access_token,
                    secret: creds.access_secret
                };
                vm.cfg.tkRequestData = {
                    url: vm.cfg.tkApiUrl,
                    method: 'GET'
                };
            }).fail(function(err) {
                window.console.log(err.responseText);
                vm.class = "error";
                $scope.$apply();

            });
            $.when(xhr1, xhr2).done(function(xhr1, xhr2) {
                vm.formatSymbols();
            });
        }
        // format symbols form json into string
        function formatSymbols() {

            if (vm.cfg.run) {
                vm.cfg.symbolStr = '';
                vm.cfg.symbolsBegCount = 0;

                $.each(vm.cfg.symbolsJSON, function(k, v) {

                    if (vm.cfg.symbolsBegCount >= vm.cfg.symbolsTiers[vm.cfg.symbolsCurTier][0] && vm.cfg.symbolsTiers[vm.cfg.symbolsCurTier][0] <= vm.cfg.symbolsCurCount && vm.cfg.symbolsCurCount <= vm.cfg.symbolsTiers[vm.cfg.symbolsCurTier][1]) {
                        vm.cfg.symbolStr += v + ',';
                        vm.cfg.symbolsCurCount++;
                    }
                    vm.cfg.symbolsBegCount++;
                });

                vm.cfg.symbolsCurTier++;

                if (vm.cfg.symbolsCurTier >= vm.cfg.symbolsTiers.length) {
                    vm.cfg.symbolsCurTier = 0;
                    vm.cfg.symbolsCurCount = 0;
                };
                vm.cfg.symbolStr = vm.cfg.symbolStr.slice(0, -1);

                vm.cfg.tkRequestData.url = vm.cfg.tkApiUrl + vm.cfg.symbolStr;
                setTimeout(function() {
                    vm.callApi();
                }, vm.cfg.apiMSecs);
            }
        }
        // Call tradeking api
        function callApi() {

            $.ajax({
                url: vm.cfg.tkRequestData.url,
                type: vm.cfg.tkRequestData.method,
                data: vm.cfg.tkOauth.authorize(vm.cfg.tkRequestData, vm.cfg.tkToken),
                beforeSend: function(xhr, settings) {
                    // hijack request url and remove duplicate symbols from oAuth
                    var symbolStr = settings.url.indexOf('&symbols=');
                    var oauthStr = settings.url.indexOf('&oauth_signature=');
                    var rmString = settings.url.substring(symbolStr, oauthStr);
                    settings.url = settings.url.replace(rmString, '');
                }

            }).error(function(err) {
                vm.class = "error";
                $scope.$apply();
                window.console.log("Bad TK Request", err);
                // after failed request try api again
                setTimeout(function() {
                    if (vm.cfg.run) {
                        vm.callApi();
                    }
                }, 3000);
            }).done(function(data) {

                vm.class = "green";
                // set date var
                vm.cfg.dateHours = new Date().getHours();
                //run tk data thru tests
                vm.quotesData = data.response.quotes.quote;
                vm.quoteScan();
            });

        }
        /*  ALL A TESTS */
        //  test stock for first move up
        function lodTestA(stock) {
            var stockDiff = Number((stock.hi - stock.lo).toFixed(2)),
                stockDiffPctA = Number((stockDiff / stock.lo).toFixed(3) * 100);

            if (stockDiffPctA >= vm.cfg.stockDiffPctA) {
                return true;
            }
        }
        //  test stock for pullback
        function hodTestA(stock) {

            var stockDiff = Number((stock.hi - stock.last).toFixed(2)),
                stockDiffPctA = Number((stockDiff / stock.hi).toFixed(3) * 100);

            if (stockDiffPctA >= vm.cfg.stockAwayPctA) {
                return true;
            }
        }
        //  test stock if it is above vwap
        function vwapTestA(stock) {

            if (stock.last >= stock.vwap) {
                return true;
            }
        }

        /*  ALL B TESTS */
        // stock below vwap
        function vwapTestB(stock) {
            if (stock.last < stock.vwap) {
                return true;
            }
        }
        // stock has good range
        function rangeTestB(stock) {
            var stockDiffB = stock.vwap - stock.lo,
                stockDiffPctB = Number((stockDiffB / stock.last).toFixed(3) * 100);
            stock.stockDiffPctB = Number(stockDiffPctB.toFixed(2));
            if (stockDiffPctB >= vm.cfg.stockRangePctB) {
                return true;
            }
        }
        // stock near midpoint(between lod and vwap)
        function betweenTestB(stock) {
            var midPoint = (stock.vwap + stock.lo) / 2,
                stockAwayMidB = Math.abs((midPoint / stock.last) - 1) * 100;
            stock.midAwayB = Math.round(stockAwayMidB * 100) / 100;
            if (stockAwayMidB < vm.cfg.stockAwayPctB) {
                return true;
            }
        }

        /*  ALL C TESTS */
        function spreadTestC(stock) {

            stock.spread = Number((stock.ask - stock.bid).toFixed(2));
            if (stock.spread <= vm.cfg.stockSpreadC) {
                return true;
            }
        }

        function moveTestC(stock) {

            $.each(vm.stocksCold, function(key, value) {

                if (stock.symbol === vm.stocksCold[key].symbol) {

                    stock.fast = Number((Math.abs((stock.last - vm.stocksCold[key].last) / stock.last) * 100).toFixed(2));

                    if (stock.fast >= vm.cfg.stockFastC) {

                        // check if stock is already in array
                        if (_.where(vm.stocksCfin, { symbol: stock.symbol }).length == 0) {
                            vm.stocksCfin.push(stock);
                        }
                    }
                }
            });
        }

        /* Global Funcs */
        function volumeTest(stock) {

            // if outside trading time use after 3/EOD volume
            if (vm.cfg.dateHours > 15 || vm.cfg.dateHours < 8) { vm.cfg.dateHours = 15; }
            if (stock.vl >= vm.cfg.stockVolume['hr' + vm.cfg.dateHours]) {
                return true;
            }
        }

        function evenTest(stock) {

            var stockPriceR = Math.round(stock.last);
            if (stock.last <= (stockPriceR + .10) && stock.last >= (stockPriceR - .10)) {
                return true;
            }
        }

        function formatStock(stock) {
            stock.bid = Math.round(stock.bid * 100) / 100;
            stock.vwap = Math.round(stock.vwap * 100) / 100;
            stock.ask = Math.round(stock.ask * 100) / 100;
            stock.lo = Math.round(stock.lo * 100) / 100;
            stock.hi = Math.round(stock.hi * 100) / 100;
            stock.vl = Number(stock.vl);
            stock.shares = Math.round((vm.cfg.accountVal / stock.last).toFixed(0) / 2);
            stock.last = Number(parseFloat(Math.round(stock.last * 100) / 100).toFixed(2));
        }

        function helperFuncs() {
            // play sound when new stocks are found
            $.extend({
                playSound: function() {
                    return $(
                        '<audio autoplay="autoplay" style="display:none;">' + '<source src="' + arguments[0] + '.mp3" />' + '<source src="' + arguments[0] + '.ogg" />' + '<embed src="' + arguments[0] + '.mp3" hidden="true" autostart="true" loop="false" class="playSound" />' + '</audio>'
                    ).appendTo('body');
                }
            });
        }

        function removeStock(stock, stocksArr) {

            stocksArr.splice(stocksArr.indexOf(stock), 1);

        }

        function removeAll(stocksArr) {

            stocksArr.length = 0;

        }

        function quoteScan() {

            $.each(vm.quotesData, function(key, stock) {

                // format stock values
                vm.formatStock(stock);

                // run all stocks thru the volume test
                if (vm.volumeTest(stock)) {
                     
                    // check if the stock passes all the A Tests
                    if (vm.lodTestA(stock) && vm.hodTestA(stock) && vm.vwapTestA(stock)) {
                        vm.stocksA.push(stock);
                    }

                    // check if the stock passes all the B Tests
                    if (vm.vwapTestB(stock) && vm.rangeTestB(stock) && vm.betweenTestB(stock)) {
                        vm.stocksB.push(stock);
                    }
                    // check if the stock passes all the C Tests
                    if (vm.spreadTestC(stock)) {
                        vm.stocksC.push(stock);

                        if (vm.stocksCold.length > 1) {

                            vm.moveTestC(stock);
                        }
                    }
                }
            });

            // empty arrays after going thru all tiers
            if (vm.cfg.symbolsCurTier === 0) {

                // play sound if vwamp stock found
                // if (vm.stocksCfin.length != vm.cfg.soundCount) {
                //     $.playSound("http://www.noiseaddicts.com/samples_1w72b820/3739");
                //     vm.cfg.soundCount = vm.stocksCfin.length;
                // }

                $scope.$apply();
                vm.stocksA = [];
                vm.stocksB = [];
                vm.stocksCold = vm.stocksC;
                vm.stocksC = [];

            }
            //  Create loop
            vm.formatSymbols();
        }

        function startScan() {
            vm.cfg.run = true;
            vm.helperFuncs();
            vm.initData();
            vm.class = "green";
        }

        function stopScan() {
            vm.cfg.run = false;
            vm.class = "red";
        }
    }
})();