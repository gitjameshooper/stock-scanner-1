(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testAFactory', testAFactory);
    testAFactory.$inject = ['$log'];

    function testAFactory($log, stock) {
        return {
            allTests: allTests
        
        };
        function allTests(stock, stockDiffPctA, stockAwayPctA){
            
            // check if the stock passes all the A Tests
            if (lodTest(stock, stockDiffPctA) && hodTest(stock, stockAwayPctA) && vwapTest(stock)) {
                return true; 
            }
        }
        // test stock for differce between lod and hod
        function lodTest(stock, stockDiffPctA) {
            var stockDiff = Number((stock.hi - stock.lo).toFixed(2)),
                stockDiffPct = Number((stockDiff / stock.lo).toFixed(3) * 100);

            if (stockDiffPct >= stockDiffPctA) {
                return true;
            }
        }
        //  test stock for pullback
        function hodTest(stock, stockAwayPctA) {

            var stockDiff = Number((stock.hi - stock.last).toFixed(2)),
                stockDiffPct = Number((stockDiff / stock.hi).toFixed(3) * 100);

            if (stockDiffPct >= stockAwayPctA) {
                return true;
            }
        }
        //  test stock if it is above vwap
        function vwapTest(stock) {

            if (stock.last >= stock.vwap) {
                return true;
            }
        }
    }
})();