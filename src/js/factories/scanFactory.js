(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('scanFactory', scanFactory);
    scanFactory.$inject = ['$log'];

    function scanFactory($log) {
        return {
            scanStock: scanStock,
            formatStock: formatStock,
            removeStock: removeStock,
            removeAllStocks: removeAllStocks
        };

        function scanStock() {

             

        }
        function formatStock(stock) {
            stock.bid = Math.round(stock.bid * 100) / 100;
            stock.vwap = Math.round(stock.vwap * 100) / 100;
            stock.ask = Math.round(stock.ask * 100) / 100;
            stock.prbook = Math.round(stock.prbook * 100) / 100;
            stock.lo = Math.round(stock.lo * 100) / 100;
            stock.hi = Math.round(stock.hi * 100) / 100;
            stock.vl = Number(stock.vl);
            stock.shares = Math.round((vm.cfg.accountVal / stock.last).toFixed(0) / 2);
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