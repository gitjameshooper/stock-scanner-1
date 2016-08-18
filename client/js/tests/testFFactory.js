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

        function allTests(stock, stocksAlert) {
            // check if the stock passes all the F Tests
            if (priceTest(stock)) {
                return true;
            }
        }

        function priceTest(stock) {

            return true;

        }

    }
})();