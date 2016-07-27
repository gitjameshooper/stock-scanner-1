(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testCFactory', testCFactory);
    testCFactory.$inject = ['$log'];

    function testCFactory($log, stock) {
        return {
            spreadTest: spreadTest,
            moveTest: moveTest

        };

        function spreadTest(stock, stockSpreadC) {

            stock.spread = Number((stock.ask - stock.bid).toFixed(2));
            if (stock.spread <= stockSpreadC) {
                return true;
            }

        }

        function moveTest(stock, stockFastC) {

            $.each(vm.stocksCOTier, function(key, value) {

                if (stock.symbol === vm.stocksCOTier[key].symbol) {

                    stock.fast = Number((Math.abs((stock.last - vm.stocksCOTier[key].last) / stock.last) * 100).toFixed(2));

                    if (stock.fast >= stockFastC) {

                        // check if stock is already in array
                        if (_.where( vm.stocksPassed.stocksPassC, { symbol: stock.symbol }).length == 0) {
                             stocksPassed.stocksPassC.push(stock);
                        }
                    }
                }
            });

            return stocksPassed.stocksPassC.push(stock);;
        }




    }
})();