// Test Notes:  Used to find a morning push and pullback near vwap for entry to go long
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testEFactory', testEFactory);
    testEFactory.$inject = ['$log', 'testOFactory'];


    function testEFactory($log, testOFactory) {
        var oldSymbolsArr = [],
            newSymbolsArr = [],
            stockIndex = null;

        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert, stockSpeedPctE) {
            // check if the stock passes all the E Tests
            if (firstPassTest(stock)) {
                return true;
            }
        }

        function firstPassTest(stock) {
                window.console.log(stock);
            if ((stock.last - .50) < stock.wk52hi && (stock.last + .50) > stock.wk52hi ) {
                 
                return true;
               }
        }
 


    }
})();