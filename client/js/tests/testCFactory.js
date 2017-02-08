// Test Notes:  Speed test
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

        function allTests(stock, stocksAlert, cfg ) {
            var loopCounter = cfg.loopCounter,
                loopCycles = cfg.loopCycles,
                loopArr1 = cfg.loopArr1,
                stockSpeedPctC = cfg.stockSpeedPctC,
                stockMaxSpreadC = cfg.stockMaxSpreadC;
 
            // check if the stock passes all the Tests
            if (loopCounter === 1) {
                loopArr1.push(stock);

            }
            if (loopCounter === 10) {
                if (speedTest(loopArr1, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
            }
            if (loopCounter === 20) {
                if (speedTest(loopArr1, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
            }
            if (loopCounter === loopCycles) {
                if (speedTest(loopArr1, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
            }
        }

        function speedTest(loopArr, stock, stocksAlert, stockSpeedPctC) {
             
            var stockSpeed = false;
            $.each(loopArr, function(key, value) {
                     
                if (stock.symbol === loopArr[key].symbol) {
                    
                    stock.speed = Number((Math.abs((stock.last - loopArr[key].last) / stock.last) * 100).toFixed(2));
                 
                     if(stock.speed >= stockSpeedPctC){
                        stockSpeed = true;
                    }
                }
            });
            return stockSpeed;
        }

        function spreadTest(stock, stockMaxSpreadC) {
       
            if (stock.spread <= stockMaxSpreadC) {
                return true;
            }
        }
    }
})();