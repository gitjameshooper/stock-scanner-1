// Test Notes:  Used to find a stock going red to green
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
        function allTests(stock, stocksAlert, stockDiffPctC) {
            if (priorDayGreenTestC(stock) && priorDayRangeTest(stock, stockDiffPctC) && midPointTest(stock) && belowPriorDayTest(stock)) {
                return true;
            }
        }
        // stock prior day green
        function priorDayGreenTestC(stock) {
            if (stock.prchg > 0) {

                return true;
            }
        }

        function priorDayRangeTest(stock, stockDiffPctC) {
            var stockDiff = Number((stock.phi - stock.plo).toFixed(2)),
                stockDiffPct = Number((stockDiff / stock.plo).toFixed(3) * 100);
            stock.stockPRDiffPctLH = Number((stockDiffPct).toFixed(2));
            if (stockDiffPct >= stockDiffPctC) {
                return true;
            }
        }

        function midPointTest(stock) {
            var stockMidPoint = Number((stock.phi + stock.plo).toFixed(2) / 2);
            if ((stock.last >= stockMidPoint) && (stock.last < stock.vwap)) {
                return true;
            }
        }

        function belowPriorDayTest(stock) {
            if (stock.last < stock.pcls) {
                return true;
            }
        }
    }
})();
// Test Notes:  Used to find a stocks with a good range
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testDFactory', testDFactory);
    testDFactory.$inject = ['$log'];

    function testDFactory($log, stock) {
        return {
            allTests: allTests

        };
        // check if the stock passes all the A Tests
        function allTests(stock, stockRangePctB, stockAwayPctB) {
            if (rangeTestB(stock, stockRangePctB) && betweenTestB(stock, stockAwayPctB)) {
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
    }
})();