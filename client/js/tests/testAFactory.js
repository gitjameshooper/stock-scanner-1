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
            if (volDayTest(stock) && volAvgTest(stock)) {
                return true;
            }
        }
            // add adv_90 volume to calcualtion
        function volDayTest(stock) {

            if (stock.volDay > 2) {

                return true;
            }
        }

        function volAvgTest(stock) {

            if (stock.volAvgDay > 2) {

                return true;
            }
        }
 

        
    }
})();
