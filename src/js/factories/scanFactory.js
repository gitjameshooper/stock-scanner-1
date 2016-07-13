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

        function scanStocks(quotesData, accountVal, stockVolumeObj, stocksPassed, stockMinPrice, stockDiffPctA, stockVwapBoxPctA, stockRangePctB, stockAwayPctB, stockSpreadC, stockFastC) {

            $.each(quotesData, function(key, stock) {

                // format stock values
                formatStock(stock, accountVal);

                // run all stocks thru the volume test
                if (testOFactory.delistTest(stock, delistArr) && testOFactory.volTest(stock, stockVolumeObj) && testOFactory.priceTest(stock, stockMinPrice)) {

                    // check if the stock passes all the A Tests
                    if (testAFactory.allTests(stock, stockDiffPctA, stockVwapBoxPctA)) {
                        stocksPassed.stocksPassA.push(stock);
                    }

                    // check if the stock passes all the B Tests
                     if (testBFactory.allTests(stock, stockRangePctB, stockAwayPctB)) {
                        stocksPassed.stocksPassB.push(stock);
                    }
                    // // check if the stock passes all the C Tests
                    // if (testCFactory.spreadTest(stock, stockSpreadC)) {
                    //     stocksPassed.stocksPassCNow.push(stock);
                        
                    //     if (stocksPassed.stocksPassCPast.length > 1) {

                    //         testCFactory.moveTest(stock, stocksPassed, stockFastC);
                    //     }
                    // }
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