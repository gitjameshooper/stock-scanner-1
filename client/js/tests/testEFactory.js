// Test Notes:  Used to find a morning push and pullback near vwap for entry to go long
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

        function allTests(stock, stocksAlert, stockSpeedPctE) {
            // check if the stock passes all the E Tests
             if(rTest(stock)){
                return true;
            }
           
        }
        function rTest(stock){
         var sty = stock.last - stock.pcls,
             pct =  Number((sty / stock.last).toFixed(2) * 100);
             stock.chg = pct;
            if((stock.pcls < stock.last) && (pct > 3)){
                return true;
            }
        }
     
 


    }
})();