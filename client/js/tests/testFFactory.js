// Test Notes:  
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testFFactory', testFFactory);
    testFFactory.$inject = ['$log', 'testOFactory'];

    function testFFactory($log, testOFactory) {
                var etfArr = ["SJNK", "OIH", "SQQQ", "XOP", "ERY", "USLV", "FAZ", "UVXY", "VIXY", "PDBC", "CATH", "VXX", "UWTI", "DWTI", "DGAZ", "DUST", "XIV", "TZA", "DBEF", "DBJP", "UGAZ", "SPXS", "XIV", "XOP", "GDX", "SVXY","TVIX","NUGT"];
        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert) {
            // check if the stock passes all the F Tests
               
            if (nanStock(stock) && stockFloat(stock) && excludeETF(stock)) {
                return true;
            }
        }
        function nanStock(stock){
            if(!isNaN(stock.float)){
                return true;
            }
        }
        function stockFloat(stock){

            if(stock.floatRotated > .80){

                return true;
            }

        }
        function excludeETF(stock) {
            if (_.indexOf(etfArr, stock.symbol) < 0) {

                return true;
            }
        }
        // // opening big diff
        // function stockLow(stock) {
            
        //        if(stock.lo < stock.plo){

        //         return true;
        //         }
             
        // }
        // function stockClose(stock) {
            
        //        if(stock.last > stock.pcls){

        //         return true;
        //         }
             
        // }
        // function stockHi(stock) {
            
        //        if(stock.last > stock.phi){

        //         return true;
        //         }
             
        // }

      

    }
})();