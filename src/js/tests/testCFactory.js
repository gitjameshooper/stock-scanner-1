(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testCFactory', testCFactory);
    testCFactory.$inject = ['$log'];

    function testCFactory($log, stock) {
        return {
            allTests: allTests

        };
        // check if the stock passes all the B Tests
        function allTests(stock) {
            if (priorDayTestC(stock)) {
                return true;
            }
        }
        // stock prior day move
        function priorDayTestC(stock) {
           
            
        }
    }
})();