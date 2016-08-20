// Test Notes:  Speed test
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testEFactory', testEFactory);
    testEFactory.$inject = ['$log', 'testOFactory'];


    function testEFactory($log, testOFactory) {
        var loop1 = [],
            loop2 = [],
            loop3 = [],
            loop4 = [],
            clearArrs = true;


        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert, stockMaxSpreadE, stockSpeedPctE, stockSpeedHighPctE, loopCounter) {
            // check if the stock passes all the E Tests
            if (loopCounter === 0) {
                if (clearArrs) {
                    loop1 = [];
                    loop2 = [];
                    loop3 = [];
                    loop4 = [];
                    clearArrs = false;
                }
                loop1.push(stock);
            }
            if (loopCounter === 1) {

                loop2.push(stock);

                if (speedTest(loop1, stock, stocksAlert, stockSpeedPctE, stockSpeedHighPctE) && spreadTest(stock, stockMaxSpreadE)) {

                    return true;
                }
            }
            if (loopCounter === 2) {

                loop3.push(stock);
                if (speedTest(loop1, stock, stocksAlert, stockSpeedPctE, stockSpeedHighPctE) && spreadTest(stock, stockMaxSpreadE)) {
                    return true;
                }
                if (speedTest(loop2, stock, stocksAlert, stockSpeedPctE, stockSpeedHighPctE) && spreadTest(stock, stockMaxSpreadE)) {
                    return true;
                }

            }
            if (loopCounter === 3) {

                if (speedTest(loop1, stock, stocksAlert, stockSpeedPctE, stockSpeedHighPctE) && spreadTest(stock, stockMaxSpreadE)) {
                    return true;
                }
                if (speedTest(loop2, stock, stocksAlert, stockSpeedPctE, stockSpeedHighPctE) && spreadTest(stock, stockMaxSpreadE)) {
                    return true;
                }
                if (speedTest(loop3, stock, stocksAlert, stockSpeedPctE, stockSpeedHighPctE) && spreadTest(stock, stockMaxSpreadE)) {
                    return true;
                }
                clearArrs = true;
            }
        }

        function speedTest(loopArr, stock, stocksAlert, stockSpeedPctE, stockSpeedHighPctE) {
            var stockSpeed = false;
            $.each(loopArr, function(key, value) {

                if (stock.symbol === loopArr[key].symbol) {


                    stock.speed = Number((Math.abs((stock.last - loopArr[key].last) / stock.last) * 100).toFixed(2));
                    window.console.log(stock.symbol+"--"+stock.speed);
                    if (stock.speed >= stockSpeedHighPctE) {
                
                        stockSpeed = true;
                        // testOFactory.stockAlert(stock, stocksAlert, true);
                
                    }else if(stock.speed >= stockSpeedPctE){
                        stockSpeed = true;
                        // testOFactory.stockAlert(stock, stocksAlert, false);
                        
                    }
                }
            });
            return stockSpeed;
        }

        function spreadTest(stock, stockMaxSpreadE) {
            if (stock.spread <= stockMaxSpreadE) {
                return true;
            }

        }
    }
})();