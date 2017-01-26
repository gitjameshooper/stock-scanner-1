// Test Notes:  Used to find stocks with float rotation
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testDFactory', testDFactory);
    testDFactory.$inject = ['$log', 'testOFactory'];

    function testDFactory($log, testOFactory) {
         var etfArr = ["EDZ","DPK","SJNK","OIH","SQQQ","XOP","ERY","USLV","FAZ","UVXY","VIXY","PDBC","CATH","VXX","UWTI","DWTI","DGAZ","DUST","XIV","TZA","DBEF","DBJP","UGAZ","SPXS","XIV","XOP","GDX","SVXY"];
        return {
            allTests: allTests

        };
        // check if the stock passes all the D Tests
        function allTests(stock, stocksAlert) {
            if (gapTestD(stock) && excludeTestD(stock)) {
                return true;
            }
        }
        // exclude etfs
        function excludeTestD(stock){
            if(_.indexOf(etfArr, stock.symbol) < 0){
            
              return true;
           }
        }
        // 
        function gapTestD(stock) {
                stock.gapPCT = (((stock.opn - stock.pcls)/stock.opn)*100).toFixed(2);
                stock.gapPCT = Number(stock.gapPCT);
             if(stock.gapPCT > 5 || stock.gapPCT < -5){
                return true;
            }
        }
         
    }
})();