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
        function allTests(stock, cfg) {

            if (checkVwapErrorB(stock) && vwapTestB(stock, cfg.stocksAlert, cfg.stockVwapPctB, cfg.stockVwapHighPctB)) {
                return true;
            }
        }
        // stock is far away from vwap
        function vwapTestB(stock, stocksAlert, stockVwapPctB, stockVwapHighPctB) {
          
            var stockDiffVwap = Number((stock.last - stock.vwap).toFixed(2)),
                stockDiffPctVwap = (stockDiffVwap / stock.last).toFixed(3) * 100;
                 stock.vwapDiff = Number(stockDiffPctVwap.toFixed(2));
               
                // for positive and negative vwap
            if (stock.vwapDiff >= stockVwapPctB || stock.vwapDiff <= (stockVwapPctB * -1)) {
              
                // alert if high interest  need to test this
                if(stockDiffPctVwap > stockVwapHighPctB || stockDiffPctVwap < (stockVwapHighPctB * -1)){
                    testOFactory.stockAlert(stock, stocksAlert, true);
                }else{
                    testOFactory.stockAlert(stock, stocksAlert, false);
                }
                return true;
            }
        }
        function checkVwapErrorB(stock) {
          
                // check for good data
            if (stock.vwap < stock.hi && stock.vwap > stock.lo) {    
                return true;
            }
        }
    }
})();