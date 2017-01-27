// Test Notes:  Used to find huge VWAP Difference. Mainly for shorting above 15% Difference
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testBFactory', testBFactory);
    testBFactory.$inject = ['$log', 'testOFactory'];

    function testBFactory($log, testOFactory) {
        return {
            allTests: allTests

        };
        // check if the stock passes all the Tests
        function allTests(stock, stocksAlert, cfg) {
            if (vwapTestB(stock, stocksAlert, cfg.stockVwapPctB, cfg.stockVwapHighPctB)) {
                return true;
            }
        }
        // stock is far away from vwap
        function vwapTestB(stock, stocksAlert, stockVwapPctB, stockVwapHighPctB) {
           
            var stockDiffVwap = Number((stock.last - stock.vwap).toFixed(2)),
                stockDiffPctVwap = (stockDiffVwap / stock.last).toFixed(3) * 100;
                 stock.vwapDiff = Number(stockDiffPctVwap.toFixed(2));
                 
                // for positive and negative vwap
            if (stock.vwapDiff >= stockVwapPctB || stock.vwapDiff <= -Math.abs(stockVwapPctB)) {
               
                // alert if high interest  need to test this
                // if(stockDiffVwapDPos > stockVwapHighPctB){
                //     testOFactory.stockAlert(stock, stocksAlert, true);
                // }else{
                //     testOFactory.stockAlert(stock, stocksAlert, false);
                // }
                return true;
            }
        }
    }
})();