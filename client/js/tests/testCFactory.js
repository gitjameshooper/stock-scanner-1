// Test Notes:  Speed test
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testCFactory', testCFactory);
    testCFactory.$inject = ['$log', 'testOFactory'];


    function testCFactory($log, testOFactory) {
        var loop1 = [],
            loop2 = [],
            loop3 = [],
            loop4 = [],
            loop5 = [],
            clearArrs = true;

        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert, cfg ) {
            var loopCounter = cfg.loopCounter,
                stockSpeedPctC = cfg.stockSpeedPctC,
                stockMaxSpreadC = cfg.stockMaxSpreadC;
            // check if the stock passes all the Tests
            if (loopCounter === 0) {
                if (clearArrs) {
                    loop1 = [];
                    loop2 = [];
                    loop3 = [];
                    loop4 = [];
                    loop5 = [];
                    clearArrs = false;
                }
                loop1.push(stock);
            }
            if (loopCounter === 1) {

                loop2.push(stock);

                if (speedTest(loop1, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {

                    return true;
                }
            }
            if (loopCounter === 2) {

                loop3.push(stock);
                if (speedTest(loop1, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
                if (speedTest(loop2, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }

            }
            if (loopCounter === 3) {

                loop4.push(stock);
                if (speedTest(loop1, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
                if (speedTest(loop2, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
                if (speedTest(loop3, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }

            }
            if (loopCounter === 4) {

                loop5.push(stock);
                if (speedTest(loop1, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
                if (speedTest(loop2, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
                if (speedTest(loop3, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
                if (speedTest(loop4, stock, stocksAlert, stockSpeedPctC) && spreadTest(stock, stockMaxSpreadC)) {
                    return true;
                }
                clearArrs = true;
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