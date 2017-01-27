// Test Notes:  Used to find a Gap stocks
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
        // check if the stock passes all the Tests
        function allTests(stock, stocksAlert, cfg) {
            if (gapTestD(stock, cfg.stockGapPctA)) {
                return true;
            }
        }

        // Measure gap
        function gapTestD(stock, stockGapPctA) {
                stock.gapPCT = (((stock.opn - stock.pcls)/stock.opn)*100).toFixed(2);
                stock.gapPCT = Number(stock.gapPCT);
             if(stock.gapPCT > stockGapPctA || stock.gapPCT < -Math.abs(stockGapPctA)){
                return true;
            }
        }
    }
})();