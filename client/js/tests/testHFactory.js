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

        function allTests(stock, cfg) {

            // check if the stock passes all the E Tests
            if (stockOpenTest(stock) && stockAboveOpenTest(stock)) {
                return true;
            }
        }

        function stockOpenTest(stock) {
             
            if(stock.hidiffloPct > 5 || stock.hidiffloWhole > 1){
                return true;
            }
            

        }
        function stockAboveOpenTest(stock) {

            if (stock.last > stock.opn) {
                return true;
            }

        }
 

    }
})();
