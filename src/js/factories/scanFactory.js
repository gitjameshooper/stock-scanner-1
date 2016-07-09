(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('scanFactory', scanFactory);
    scanFactory.$inject = ['$log', 'testVolFactory'];

    function scanFactory($log, testVolFactory) {
        return {
            scanStocks: scanStocks,
            formatStock: formatStock,
            removeStock: removeStock,
            removeAllStocks: removeAllStocks
        };

        function scanStocks(quotesData, accountVal, stockVolumeObj) {
              $.each(quotesData, function(key, stock) {
                
                // format stock values
                formatStock(stock, accountVal);
               
                // run all stocks thru the volume test
                if (testVolFactory.volTest(stock, stockVolumeObj)) {
                     
                    window.console.log(stock);

                    // check if the stock passes all the A Tests
                    if (vm.lodTestA(stock) && vm.hodTestA(stock) && vm.vwapTestA(stock)) {
                         vm.stocksATier.push(stock);
                    }

                    // check if the stock passes all the B Tests
                    if (vm.vwapTestB(stock) && vm.rangeTestB(stock) && vm.betweenTestB(stock)) {
                        vm.stocksBTier.push(stock);
                    }
                    // check if the stock passes all the C Tests
                    if (vm.spreadTestC(stock)) {
                        vm.stocksCTier.push(stock);

                        if (vm.stocksCOTier.length > 1) {

                            vm.moveTestC(stock);
                        }
                    }
                }
            });
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
            stock.last = Number(parseFloat(Math.round(stock.last * 100) / 100).toFixed(2));
        }
 
        function removeStock(stock, stocksArr) {

            stocksArr.splice(stocksArr.indexOf(stock), 1);

        }

        function removeAllStocks(stocksArr) {

            stocksArr.length = 0;

        }
        
       
    }
})();