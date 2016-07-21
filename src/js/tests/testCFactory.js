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