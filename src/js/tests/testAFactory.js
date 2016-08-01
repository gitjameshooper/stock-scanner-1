// Test Notes:  Used to find a morning push and pullback near vwap for entry to go long
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testAFactory', testAFactory);
    testAFactory.$inject = ['$log', 'testOFactory'];

    function testAFactory($log, testOFactory) {
        return {
            allTests: allTests
        
        };
        function allTests(stock, stocksAlert, stockDiffPctA){
            // check if the stock passes all the A Tests
            if (lodHodTest(stock, stockDiffPctA) && vwapTest(stock)) {
                return true; 
            }
        }
        // for difference between lod and hod
        function lodHodTest(stock, stockDiffPctA) {

            var stockDiff = Number((stock.hi - stock.lo).toFixed(2)),
                stockDiffPct = Number((stockDiff / stock.lo).toFixed(3) * 100);
                stock.stockDiffPctLH = Number((stockDiffPct).toFixed(2));
            if (stockDiffPct >= stockDiffPctA) {
                return true;
            }
        }
        // if close to vwap
        function vwapTest(stock) {
               var stockVwapMidpoint = (stock.vwap + stock.hi) / 2;
              
            if ((stock.last <= stockVwapMidpoint) && (stock.last >= stock.vwap)) {
                return true;
            }
        }
    }
})();