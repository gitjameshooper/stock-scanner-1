// Test Notes:  Morning volume test
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testEFactory', testEFactory);
    testEFactory.$inject = ['$log', 'testOFactory'];


    function testEFactory($log, testOFactory) {


        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert) {
            // check if the stock passes all the E Tests

            if (priceTest(stock)) {
                return true;
            }
        }

        function priceTest(stock) {

         
            
                return true;
             
        }
    }
})();