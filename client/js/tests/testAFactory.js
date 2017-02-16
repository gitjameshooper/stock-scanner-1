// Test Notes:  Used to find a Gap stocks
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testAFactory', testAFactory);
    testAFactory.$inject = ['$log', 'testOFactory'];

    function testAFactory($log, testOFactory) {
         return {
            allTests: allTests

        };
        // check if the stock passes all the Tests
        function allTests(stock, stocksAlert, cfg) {
            if (aboveVWAP(stock) && abovePchg(stock)) {
                return true;
            }
        }

        
        function abovePchg(stock) {
                 
             if(stock.pchg > 2){
                return true;
            }
        }
        function aboveVWAP(stock){
            
            if(stock.last > stock.vwap){
                 
                return true;
            }

        }
    }
})();