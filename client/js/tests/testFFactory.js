// Test Notes:  
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testFFactory', testFFactory);
    testFFactory.$inject = ['$log', 'testOFactory'];

    function testFFactory($log, testOFactory) {
        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert, stockAwayPctF) {
            // check if the stock passes all the F Tests
            if (betweenTestF(stock, stockAwayPctF)) {
                return true;
            }
        }

        // stock near midpoint(between lo and hi)
        function betweenTestF(stock, stockAwayPctF) {
            var midPoint = (stock.hi + stock.lo) / 2,
                stockAwayMidB = Math.abs((midPoint / stock.last) - 1) * 100;
            stock.midAwayB = Math.round(stockAwayMidB * 100) / 100;
            if (stockAwayMidB < 1) {
                return true;
            }
        }

    }
})();