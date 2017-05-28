// Test Notes:  Used for volume stocks
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
        function allTests(stock, cfg) {
            
            if (volDayTest(stock) && volAvgTest(stock) && tradesTest(stock) && rangeTest(stock)) {

                return true;
            }
        }
            // add adv_90 volume to calcualtion
        function volDayTest(stock) {

            if (stock.volDay > 1.5) {

                return true;
            }
        }

        function volAvgTest(stock) {

            if (stock.volAvgDay > 2) {

                return true;
            }
        }
          function tradesTest(stock) {

            if (stock.tr_num > 30000) {

                return true;
            }
        }
        function rangeTest(stock) {

            if (stock.hidiffloWhole > 1) {

                return true;
            }
        }
 
 

        
    }
})();
