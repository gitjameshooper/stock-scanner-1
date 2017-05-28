(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('scanFactory', scanFactory);
    scanFactory.$inject = ['$log', 'testOFactory', 'testAFactory', 'testBFactory', 'testCFactory', 'testDFactory', 'testEFactory', 'testGFactory', 'testHFactory'];

    function scanFactory($log, testOFactory, testAFactory, testBFactory, testCFactory, testDFactory, testEFactory, testGFactory, testHFactory) {
        var delistArr = JSON.parse(localStorage.getItem("delist")) || [];

        return {
            scanStocks: scanStocks,
            formatStock: formatStock,
            delistStock: delistStock,
            testStocks: testStocks,
            mergeFloatData: mergeFloatData,
            addLocalStorage: addLocalStorage,
            emptyLocalStorage: emptyLocalStorage,
            emptyDelist: emptyDelist
        };

        function scanStocks(quotesData, stocksPassed, symbolsJSON, cfg) {

            $.each(quotesData, function(key, stock) {

                // if testing don't run stocks through global tests
                if (cfg.testing) {
                    if(stock.vl > 800000){
                        testStocks(quotesData, stocksPassed, symbolsJSON, cfg, key, stock);
                    }
                } else {
                    // run all stocks thru global tests: delist, halt, volume, price   
                    if (testOFactory.delistTest(stock, JSON.parse(localStorage.getItem("delist"))) && testOFactory.haltTest(stock) && testOFactory.volTest(stock, cfg.stockVolumeObj) && testOFactory.priceTest(stock, cfg.stockMinPrice, cfg.stockMaxPrice)) {

                        testStocks(quotesData, stocksPassed, symbolsJSON, cfg, key, stock);
                    }
                }
            });
            return stocksPassed;
        }

        function mergeFloatData(quotesData, stocksPassed, symbolsJSON, cfg, key, stock) {
            // merge stock float data from JSON
            if (cfg.showTest.testD) {
                $.each(symbolsJSON, function(k, v) {
                    if (stock.symbol == v.symbol) {
                        stock.float = v.float;
                        stock.shortRatio = v.shortRatio;
                    }
                });
            } else {
                stock.float = 0;
                stock.shortRatio = 0;
            }
        }

        function testStocks(quotesData, stocksPassed, symbolsJSON, cfg, key, stock) {

            // merge float data to api data
            mergeFloatData(quotesData, stocksPassed, symbolsJSON, cfg, key, stock);
            // format stock values
            formatStock(stock, cfg.accountVal);
            // check if the stock passes all the A Tests
            if (cfg.showTest.testA && testAFactory.allTests(stock, cfg)) {
                stocksPassed.stocksPassA.push(stock);
                addLocalStorage('testA', stock);
            }
            // check if the stock passes all the B Tests
            if (cfg.showTest.testB && testOFactory.excludeETF(stock, cfg.includeETF, cfg.etfArr) && testBFactory.allTests(stock, cfg)) {
                stocksPassed.stocksPassB.push(stock);
                addLocalStorage('testB', stock);
            }
            // check if the stock passes all the C Tests
            if (cfg.showTest.testC && testOFactory.excludeETF(stock, cfg.includeETF, cfg.etfArr) && testCFactory.allTests(stock, cfg)) {
                stocksPassed.stocksPassC.push(stock);
                addLocalStorage('testC', stock);
            }
            // check if the stock passes all the D Tests
            if (cfg.showTest.testD && testOFactory.excludeETF(stock, cfg.includeETF, cfg.etfArr) && testDFactory.allTests(stock, cfg)) {
                stocksPassed.stocksPassD.push(stock);
                addLocalStorage('testD', stock);
            }
            // check if the stock passes all the E Tests
            if (cfg.showTest.testE && testOFactory.excludeETF(stock, cfg.includeETF, cfg.etfArr) && testEFactory.allTests(stock, cfg)) {
                stocksPassed.stocksPassE.push(stock);
                addLocalStorage('testE', stock);
            }
            if (cfg.showTest.testG && testOFactory.excludeETF(stock, cfg.includeETF, cfg.etfArr) && testGFactory.allTests(stock, cfg)) {
                stocksPassed.stocksPassG.push(stock);
                addLocalStorage('testG', stock);
            }
            if (cfg.showTest.testH && testOFactory.excludeETF(stock, cfg.includeETF, cfg.etfArr) && testHFactory.allTests(stock, cfg)) {
                stocksPassed.stocksPassH.push(stock);
                addLocalStorage('testH', stock);
            }
        }

        function formatStock(stock, accountVal) {
            // main stock data
            stock.bid = Math.round(Number(stock.bid) * 100) / 100;
            stock.vwap = Math.round(stock.vwap * 100) / 100;
            stock.ask = Math.round(stock.ask * 100) / 100;
            stock.prbook = Math.round(stock.prbook * 100) / 100;
            stock.lo = Math.round(stock.lo * 100) / 100;
            stock.hi = Math.round(stock.hi * 100) / 100;
            stock.cl = Math.round(stock.cl * 100) / 100;
            stock.last = Math.round(stock.last * 100) / 100;
            stock.vl = Number(stock.vl);
            stock.tr_num = Number(stock.tr_num);
            stock.pvol = Number(stock.pvol);
            stock.sho = Number(stock.sho);
            stock.chg = Number(stock.chg);
            stock.pchg = Number(stock.pchg);
            stock.opn = Math.round(stock.opn * 100) / 100;
            stock.plo = Math.round(stock.plo * 100) / 100;
            stock.phi = Math.round(stock.phi * 100) / 100;
            stock.popn = Math.round(stock.popn * 100) / 100;
            stock.pcls = Math.round(stock.pcls * 100) / 100;
            stock.prchg = Number(stock.prchg);

            // calculated for tests
            stock.mid = Math.round(((stock.hi + stock.lo) / 2) * 100) / 100;
            stock.hidiffloWhole = Math.round((stock.hi - stock.lo) * 100) / 100;
            stock.hidiffloPct = Math.round(((stock.hi - stock.lo) / stock.last) * 100);
            stock.vwapAway = Number(Math.abs(stock.last - stock.vwap).toFixed(2));
            stock.closeMid = Math.round(Math.abs(stock.mid - stock.last) * 100) / 100;

            stock.volDay = Math.round((stock.vl / stock.pvol)*100)/100;
            stock.volAvgDay = Math.round((stock.vl / stock.adv_90)*100)/100;
            stock.volRotated = Math.round((stock.vl / stock.pvol) * 100) / 100;
            stock.volDRange = stock.volDay * stock.hidifflo;

            stock.hivwap = Math.round((stock.hi - stock.vwap)*100) / 100;
            stock.float = Math.round(stock.float * 100) / 100;
            stock.pole = Number(stock.hi - stock.opn);
            stock.flag = Math.round((((stock.pole * .50) + (stock.hivwap * .50)) / stock.last) * 100) / 100;
            stock.floatRotated = Math.round((stock.vl / stock.float) * 100) / 100;
            stock.shortRatio = Number(stock.shortRatio);
            stock.shares = Math.round((accountVal / stock.last).toFixed(0) / 2);
            stock.shares = Math.ceil(stock.shares / 100) * 100;
            stock.spread = Number((stock.ask - stock.bid).toFixed(2));

        }

        function addLocalStorage(testName, stock) {
            if (!JSON.parse(localStorage.getItem(testName))) {
                localStorage.setItem(testName, JSON.stringify(stock.symbol));
            } else {
                var stockSymbols = JSON.parse(localStorage.getItem(testName));
                if (stockSymbols.indexOf(stock.symbol) < 0) {
                    stockSymbols += ',' + stock.symbol;
                    localStorage.setItem(testName, JSON.stringify(stockSymbols));
                }
            }
        }

        function emptyLocalStorage(tests) {
            $.each(tests, function(key, value) {
                localStorage.removeItem(key);
            });
        }

        // remove stock from view - add to the delist array
        function delistStock(stock, stocksArr) {
            stocksArr.splice(stocksArr.indexOf(stock), 1);
            delistArr.push(stock.symbol);
            localStorage.setItem("delist", JSON.stringify(delistArr));
        }

        function emptyDelist() {
            delistArr = [];
            localStorage.removeItem('delist');
        }

    }
})();
