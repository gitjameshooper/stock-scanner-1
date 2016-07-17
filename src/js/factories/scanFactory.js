(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('scanFactory', scanFactory);
    scanFactory.$inject = ['$log', 'testOFactory', 'testAFactory', 'testBFactory', 'testCFactory'];

    function scanFactory($log, testOFactory, testAFactory, testBFactory, testCFactory) {
        var delistArr = [];
        return {
            scanStocks: scanStocks,
            formatStock: formatStock,
            removeStock: removeStock,
            removeAllStocks: removeAllStocks
        };

        function scanStocks(quotesData, stocksPassed, cfg) {

            $.each(quotesData, function(key, stock) {

                // format stock values
                formatStock(stock, cfg.accountVal);

                // run all stocks thru the volume test
                if (testOFactory.delistTest(stock, delistArr) && testOFactory.volTest(stock, cfg.stockVolumeObj) && testOFactory.priceTest(stock, cfg.stockMinPrice, cfg.stockMaxPrice)) {

                    // check if the stock passes all the A Tests
                    if (testAFactory.allTests(stock, cfg.stockDiffPctA, cfg.stockVwapBoxPctA)) {
                        stocksPassed.stocksPassA.push(stock);
                    }

                    // check if the stock passes all the B Tests
                     if (testBFactory.allTests(stock, cfg.stockRangePctB, cfg.stockVwapHighPctB)) {
                        stocksPassed.stocksPassB.push(stock);
                    }
                    // // check if the stock passes all the C Tests
                    if (testCFactory.allTests(stock)) {
                        stocksPassed.stocksPassC.push(stock);
                    }
                }
            });
            return stocksPassed;
        }

        function formatStock(stock, accountVal) {
            stock.bid = Math.round(stock.bid * 100) / 100;
            stock.vwap = Math.round(stock.vwap * 100) / 100;
            stock.ask = Math.round(stock.ask * 100) / 100;
            stock.prbook = Math.round(stock.prbook * 100) / 100;
            stock.lo = Math.round(stock.lo * 100) / 100;
            stock.hi = Math.round(stock.hi * 100) / 100;
            stock.vl = Number(stock.vl);
            stock.plo = Math.round(stock.plo * 100) / 100;
            stock.phi = Math.round(stock.phi * 100) / 100;
            stock.shares = Math.round((accountVal / stock.last).toFixed(0) / 2);
            stock.last = Math.round(stock.last * 100) / 100;
        }
        // remove stock from view - add to the delist array
        function removeStock(stock, stocksArr) {
            stocksArr.splice(stocksArr.indexOf(stock), 1);
            delistArr.push(stock.symbol);
        }
        function removeAllStocks(stocksArr) {
            stocksArr.length = 0;
        }
    }
})();