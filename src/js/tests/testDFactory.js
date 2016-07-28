// Test Notes:  Used to find stocks with float rotation
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testDFactory', testDFactory);
    testDFactory.$inject = ['$log', 'testOFactory'];

    function testDFactory($log, testOFactory) {
        var etfArr = ["ERY","USLV","FAZ","UVXY","VIXY","PDBC","CATH","VXX","UWTI","DWTI","DGAZ","DUST","XIV","TZA","DBEF","DBJP","UGAZ","SPXS","XIV","XOP","GDX","SVXY"];
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
             stock.float = Math.round((stock.vl / stock.sho) * 100) / 100;
             if(stock.float !== Infinity && stock.float > .50){
                return true;
            }
        }
         
    }
})();