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
// Test Notes:  Used to find volume traded over prior day
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
        // check if the stock passes all the Tests
        function allTests(stock, stocksAlert, cfg) {
            if (volTestE(stock)) {
                return true;
            }
        }

        // Measure volume
        function volTestE(stock) {

              if(stock.volRotated > 1){
                return true;
              }
        }
        
    }
})();
// Test Notes:  Bearish engulfing or bullish engulfing
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testFFactory', testFFactory);
    testFFactory.$inject = ['$log', 'testOFactory'];

    function testFFactory($log, testOFactory) {
        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert, stockAwayPctF) {
            // check if the stock passes all the F Tests
            if (priorRedF(stock, stockAwayPctF) && belowCloseF(stock, stockAwayPctF) && aboveOpenF(stock, stockAwayPctF)) {
                return true;
            }
        }
        // prior day red
        function priorRedF(stock, stockAwayPctF) {
            if (stock.prchg > 0) {
                return true;
            }
        }
        // stock opens lower than close
        function belowCloseF(stock, stockAwayPctF) {  
    
            if (stock.pcls < stock.opn) {
                return true;
            }
        }
                // stock currently above prior day open
        function aboveOpenF(stock, stockAwayPctF) {  
            if (stock.popn > stock.last) {
                return true;
            }
        }

    }
})();
// Test Notes:  Bounce off VWAP test
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testFFactory', testFFactory);
    testFFactory.$inject = ['$log', 'testOFactory'];


    function testFFactory($log, testOFactory) {

        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert, stockBounceF) {
            // check if the stock passes all the F Tests
            if (lodTest(stock, stockBounceF) || hodTest(stock, stockBounceF)) {
                return true;
            }
        }

        function lodTest(stock, stockBounceF) {
            var stockLoDiff = ((stock.lo - stock.vwap) / stock.last) * 100;

            if (stock.last < stock.pcls && stock.last < stock.vwap && stockLoDiff < -stockBounceF) {
                stock.vwapDistF = Number(stockLoDiff.toFixed(2));
                return true;
            }

        }

        function hodTest(stock, stockBounceF) {
            var stockHiDiff = ((stock.hi - stock.vwap) / stock.last) * 100;

            if (stock.last > stock.pcls && stock.last > stock.vwap && stockHiDiff > stockBounceF) {
                stock.vwapDistF = Number(stockHiDiff.toFixed(2));
                return true;
            }
        }

    }
})();