// Test Notes:  Used to find stocks with float rotation
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testDFactory', testDFactory);
    testDFactory.$inject = ['$log', 'testOFactory'];

    function testDFactory($log, testOFactory) {
         var etfArr = ["SJNK","OIH","SQQQ","XOP","ERY","USLV","FAZ","UVXY","VIXY","PDBC","CATH","VXX","UWTI","DWTI","DGAZ","DUST","XIV","TZA","DBEF","DBJP","UGAZ","SPXS","XIV","XOP","GDX","SVXY"];
        return {
            allTests: allTests

        };
        // check if the stock passes all the D Tests
        function allTests(stock, stocksAlert) {
            if (sharesTestD(stock) && excludeTestD(stock)) {
                return true;
            }
        }
        // exclude etfs
        function excludeTestD(stock){
            if(_.indexOf(etfArr, stock.symbol) < 0){
            
              return true;
           }
        }
        // trading most shares outstanding
        function sharesTestD(stock) {
             
             if(stock.float !== Infinity && stock.float > .30){
                return true;
            }
        }
         
    }
})();