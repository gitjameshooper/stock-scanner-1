(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testDFactory', testDFactory);
    testDFactory.$inject = ['$log'];

    function testDFactory($log, stock) {
        var etfArr = ["PDBC","CATH","VXX","UWTI","DWTI","DGAZ","DUST","XIV","TZA","DBEF","DBJP","UGAZ","SPXS","XIV","XOP","GDX","SVXY"];
        return {
            allTests: allTests

        };
        // check if the stock passes all the A Tests
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
        // stock has good range
        function sharesTestD(stock) {
             stock.float = Math.round((stock.vl / stock.sho) * 100) / 100;
             if(stock.float !== Infinity && stock.float > .50){
                return true;
            }
        }
         
    }
})();