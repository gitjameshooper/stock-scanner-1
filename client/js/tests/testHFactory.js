// Test Notes:  Used to find stocks for ABCD midday trade
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testHFactory', testHFactory);
    testHFactory.$inject = ['$log', 'testOFactory'];

    function testHFactory($log, testOFactory) {
        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert) {

            // check if the stock passes all the E Tests
            if (stockOpenTest(stock) && stockAboveMidTest(stock)) {
                return true;
            }
        }

        function stockOpenTest(stock) {

            if ((stock.chg > 0) && (stock.hidifflo > 3)) {
                return true;
            }

        }
        function stockAboveMidTest(stock) {

            if (stock.last > stock.mid) {
                return true;
            }

        }
 

    }
})();
