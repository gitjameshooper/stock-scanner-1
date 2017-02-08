// Test Notes:  Used to find volume traded over prior day
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
        // check if the stock passes all the Tests
        function allTests(stock, stocksAlert, cfg) {
            if (volTestE(stock)) {
                return true;
            }
        }

        // Measure volume
        function volTestE(stock) {

              if(stock.volRotated > 1){
                return true;
              }
        }
        
    }
})();