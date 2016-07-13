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
        function allTests(stock, stockDiffPctA, stockVwapBoxPctA){
            
            // check if the stock passes all the A Tests
            if (priorDayTest(stock) && lodHodTest(stock, stockDiffPctA) && vwapTest(stock, stockVwapBoxPctA)) {
                return true; 
            }
        }
        // test stock for difference between lod and hod
        function lodHodTest(stock, stockDiffPctA) {
            var stockDiff = Number((stock.hi - stock.lo).toFixed(2)),
                stockDiffPct = Number((stockDiff / stock.lo).toFixed(3) * 100);
                stock.stockDiffPctLH = Number((stockDiffPct).toFixed(2));
            if (stockDiffPct >= stockDiffPctA) {
                return true;
            }
        }
        // test stock if close to vwap
        function vwapTest(stock, stockVwapBoxPctA) {
            var vwapPriceDiff = stock.vwap * (stockVwapBoxPctA / 100),
                vwapPriceHi = stock.vwap + vwapPriceDiff,
                vwapPriceLo = stock.vwap - vwapPriceDiff;
            if ((stock.last <= vwapPriceHi) && (stock.last >= vwapPriceLo)) {
                return true;
            }
        }
        // test stock if higher than prior day lo
        function priorDayTest(stock) {
            if (stock.plo < stock.lo) {
                return true;
            }
        }
    }
})();