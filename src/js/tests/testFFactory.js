// Test Notes:  Used to find a morning push and pullback near vwap for entry to go long
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