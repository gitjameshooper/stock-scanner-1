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
           
            if (stockVolumeF(stock, stockAwayPctF)) {
                return true;
            }
        }
        // opening big diff
        function stockVolumeF(stock, stockAwayPctF) {
            
               if(stock.vl > stock.pvol){

                return true;
                }
             
        }

      

    }
})();