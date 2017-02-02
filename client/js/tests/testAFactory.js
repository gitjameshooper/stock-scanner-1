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
            if (gapTestD(stock, cfg.stockGapPctA) && nearVWAP(stock)) {
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
        function nearVWAP(stock){
            var inc = .10;
            if (stock.last > 5) { 
                inc = .15;
            }else if(stock.last > 30){
                inc = .25;
            }else if(stock.last > 30){
                inc = .30;
            }
            if(stock.last < (stock.vwap + inc) && stock.last > (stock.vwap - inc)){
                 
                return true;
            }

        }
    }
})();