(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('scanFactory', scanFactory);
    scanFactory.$inject = ['$log', 'testOFactory', 'testAFactory', 'testBFactory', 'testCFactory', 'testDFactory'];

    function scanFactory($log, testOFactory, testAFactory, testBFactory, testCFactory, testDFactory) {
        var delistArr = [];

        return {
            scanStocks: scanStocks,
            formatStock: formatStock,
            delistStock: delistStock
        };

        function scanStocks(quotesData, stocksPassed, cfg) {

            $.each(quotesData, function(key, stock) {

                // format stock values
                formatStock(stock, cfg.accountVal);

                // run all stocks thru the delist, volume, price test
                if (testOFactory.delistTest(stock, delistArr) && testOFactory.volTest(stock, cfg.stockVolumeObj) && testOFactory.priceTest(stock, cfg.stockMinPrice, cfg.stockMaxPrice)) {

                    // check if the stock passes all the A Tests
                    if (duplicateStock(stock, stocksPassed.stocksPassA) && testAFactory.allTests(stock, stocksPassed.stocksAlert, cfg.stockDiffPctA)) {
                        stocksPassed.stocksPassA.push(stock);
                    }

                    // check if the stock passes all the B Tests
                    if (duplicateStock(stock, stocksPassed.stocksPassB) && testBFactory.allTests(stock, stocksPassed.stocksAlert, cfg.stockVwapPctB, cfg.stockVwapHighPctB)) {
                        stocksPassed.stocksPassB.push(stock);
                    }
                    // check if the stock passes all the C Tests
                    if (duplicateStock(stock, stocksPassed.stocksPassC) && testCFactory.allTests(stock, stocksPassed.stocksAlert, cfg.stockDiffPctC)) {
                        stocksPassed.stocksPassC.push(stock);
                    }
                    // check if the stock passes all the D Tests
                    if (duplicateStock(stock, stocksPassed.stocksPassD) && testDFactory.allTests(stock, stocksPassed.stocksAlert)) {
                        stocksPassed.stocksPassD.push(stock);
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
            stock.sho = Number(stock.sho);
            stock.plo = Math.round(stock.plo * 100) / 100;
            stock.phi = Math.round(stock.phi * 100) / 100;
            stock.pcls = Math.round(stock.pcls * 100) / 100;
            stock.prchg = Number(stock.prchg);
            stock.shares = Math.round((accountVal / stock.last).toFixed(0) / 2);
            stock.last = Math.round(stock.last * 100) / 100;
        }
        function duplicateStock(stock, stocksArr){
             var stockIndex = _.findIndex(stocksArr, {symbol : stock.symbol});
             if(stockIndex !== -1){ 
                stocksArr.splice(stockIndex,1);  
            }
            return true;     
        }
        // remove stock from view - add to the delist array
        function delistStock(stock, stocksArr) {
            stocksArr.splice(stocksArr.indexOf(stock), 1);
            delistArr.push(stock.symbol);
        }
    }
})();