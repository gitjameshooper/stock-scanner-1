// Test Notes:  Used to find a morning push and pullback near vwap for entry to go long
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

        function allTests(stock, stocksAlert, stockDiffPctA) {
            // check if the stock passes all the A Tests
            if (priceTest(stock) && volTest(stock)) {
                return true;
            }
        }
        //  
        function priceTest(stock) {

            if (stock.adp_50 < stock.adp_100) {
            	stock.random = stock.adp_50 - stock.adp_100;
                return true;
            }
        }
        // 
        function volTest(stock) {

            if (stock.adv_30 > stock.adv_90) {
                return true;
            }
        }
    }
})();