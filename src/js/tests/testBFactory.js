(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testBFactory', testBFactory);
    testBFactory.$inject = ['$log'];

    function testBFactory($log, stock) {
        return {
            allTests: allTests

        };
        // check if the stock passes all the A Tests
        function allTests(stock, stockRangePctB, stockAwayPctB) {
            if (rangeTestB(stock, stockRangePctB) && betweenTestB(stock, stockAwayPctB) && vwapTest(stock)) {
                return true;
            }
        }
        // stock has good range
        function rangeTestB(stock, stockRangePctB) {
            var stockDiffB = stock.vwap - stock.lo,
                stockDiffPctB = Number((stockDiffB / stock.last).toFixed(3) * 100);
                stock.stockDiffPctB = Number(stockDiffPctB.toFixed(2));
            if (stockDiffPctB >= stockRangePctB) {
                return true;
            }
        }
        // stock near midpoint(between lod and vwap)
        function betweenTestB(stock, stockAwayPctB) {
            var midPoint = (stock.vwap + stock.lo) / 2,
                stockAwayMidB = Math.abs((midPoint / stock.last) - 1) * 100;
                stock.midAwayB = Math.round(stockAwayMidB * 100) / 100;
            if (stockAwayMidB < stockAwayPctB) {
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