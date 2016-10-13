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
            if (priorRedF(stock, stockAwayPctF) && belowCloseF(stock, stockAwayPctF) && aboveOpenF(stock, stockAwayPctF)) {
                return true;
            }
        }
        // prior day red
        function priorRedF(stock, stockAwayPctF) {

            if (stock.prchg < 0) {
                return true;
            }
        }
        // stock opens lower than close
        function belowCloseF(stock, stockAwayPctF) {  
    
            if (stock.pcls > stock.opn) {
                return true;
            }
        }
                // stock currently above prior day open
        function aboveOpenF(stock, stockAwayPctF) {  
            if (stock.popn < stock.last) {
                return true;
            }
        }

    }
})();