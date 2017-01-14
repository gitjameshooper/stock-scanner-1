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
           
            if (stockLow(stock) && stockHi(stock) && stockClose(stock)) {
                return true;
            }
        }
        // opening big diff
        function stockLow(stock) {
            
               if(stock.lo < stock.plo){

                return true;
                }
             
        }
        function stockClose(stock) {
            
               if(stock.last > stock.pcls){

                return true;
                }
             
        }
        function stockHi(stock) {
            
               if(stock.last > stock.phi){

                return true;
                }
             
        }

      

    }
})();