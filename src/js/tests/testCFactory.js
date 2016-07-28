// Test Notes:  Used to find stocks red to green 
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testCFactory', testCFactory);
    testCFactory.$inject = ['$log', 'testOFactory'];

    function testCFactory($log, testOFactory) {
         
        return {
            allTests: allTests

        };
        // check if the stock passes all the C Tests
        function allTests(stock, stocksAlert) {
            if (lodTestC(stock)  && priorHODTestC(stock) && (vwapTestC(stock) || currPriceTestC(stock))) {
                return true;
            }
        }
        // if below prior low
        function lodTestC(stock){
            if(stock.plo > stock.lo){
                return true;
            }
        }
        // if higher than prior day close
        function currPriceTestC(stock){
            if(stock.last >= stock.pcls){
                return true;
            }
        }
        // stock above vwap
        function vwapTestC(stock){
            if(stock.last > stock.vwap){
                return true;
            }
        }
        // if 
        function priorHODTestC(stock){
            var priorDiff = stock.phi - stock.lo,
                priorPct = priorDiff / stock.lo;
                stock.stockDiffPriorPctLtoH = Number((priorPct).toFixed(2));
                 
                return true;
        }
           
 
    }
})();