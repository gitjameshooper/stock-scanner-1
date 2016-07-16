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
        // check if the stock passes all the B Tests
        function allTests(stock, stockVwapPctB, stockVwapHighPctB) {
            if (vwapTestB(stock, stockVwapPctB, stockVwapHighPctB)) {
                return true;
            }
        }
        // stock is away from vwap
        function vwapTestB(stock, stockVwapPctB, stockVwapHighPctB) {
           
             var stockDiffVwap = Number((stock.last - stock.vwap).toFixed(2)),
                stockDiffPctVwapD = (stockDiffVwap / stock.last).toFixed(3) * 100,
                stockDiffVwapDPos = Math.abs(stockDiffPctVwapD);
                stock.vwapDiff = Number(stockDiffPctVwapD.toFixed(2));
                stockDiffVwapDPos = Math.abs(stockDiffPctVwapD);

            if (stockDiffVwapDPos >= stockVwapPctB) {
                // alert if high interest
                if(stockDiffVwapDPos > stockVwapHighPctB){
                    stock.class = 'green';
                    $.playSound("http://www.noiseaddicts.com/samples_1w72b820/3739");
                }
                return true;
            }
        }
    }
})();