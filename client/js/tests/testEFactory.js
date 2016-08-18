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
            loop4 = [];

        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert, loopCounter) {
            // check if the stock passes all the E Tests
            if (loopCounter === 0) {

                loop1.push(stock);
            }
            if (loopCounter === 1) {

                loop2.push(stock);
                window.console.log(speedTest(loop1, stock));
                if (speedTest(loop1, stock)) {
                    window.console.log('loop1');
                    return true;
                }
            }
            if (loopCounter === 2) {

                loop3.push(stock);
                if (speedTest(loop1, stock)) {
                    return true;
                }
                if (speedTest(loop2, stock)) {
                    return true;
                }

            }
            if (loopCounter === 3) {

                if (speedTest(loop1, stock)) {
                    return true;
                }
                if (speedTest(loop2, stock)) {
                    return true;
                }
                if (speedTest(loop3, stock)) {
                    return true;
                }
            }
        }

        function speedTest(loopArr, stock) {
            $.each(loopArr, function(key, value) {

                if (stock.symbol === loopArr[key].symbol) {
                    window.console.log(stock.symbol);
                    return true;
                    stock.fast = Number((Math.abs((stock.last - loopArr[key].last) / stock.last) * 100).toFixed(2));
                    // window.console.log(stock.fast);
                    if (stock.fast >= .02) {
                        // window.console.log(stock);
                        
                        // // check if stock is already in array
                        // if (_.where(vm.stocksPassed.stocksPassC, { symbol: stock.symbol }).length == 0) {
                        //     stocksPassed.stocksPassC.push(stock);
                        // }
                    }
                }
            });
           
        }

        function spreadTest(stock) {

            stock.spread = Number((stock.ask - stock.bid).toFixed(2));
            if (stock.spread <= .15) {
                return true;
            }

        }
    }
})();