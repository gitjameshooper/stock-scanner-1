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
        // check if the stock passes all the B Tests
        function allTests(stock, stocksAlert, stockVwapPctB, stockVwapHighPctB) {
            if (vwapTestB(stock, stocksAlert, stockVwapPctB, stockVwapHighPctB)) {
                return true;
            }
        }
        // stock is away from vwap
        function vwapTestB(stock, stocksAlert, stockVwapPctB, stockVwapHighPctB) {
           
             var stockDiffVwap = Number((stock.last - stock.vwap).toFixed(2)),
                stockDiffPctVwapD = (stockDiffVwap / stock.last).toFixed(3) * 100,
                stockDiffVwapDPos = Math.abs(stockDiffPctVwapD);
                stock.vwapDiff = Number(stockDiffPctVwapD.toFixed(2));
                stockDiffVwapDPos = Math.abs(stockDiffPctVwapD);

            if (stockDiffVwapDPos >= stockVwapPctB) {
               
                // alert if high interest
                if(stockDiffVwapDPos > stockVwapHighPctB){
                    testOFactory.stockAlert(stock, stocksAlert, true);
                }else{
                    testOFactory.stockAlert(stock, stocksAlert, false);
                }
                return true;
            }
        }
    }
})();