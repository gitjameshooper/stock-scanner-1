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
            var  stocksAlert = cfg.stocksAlert;
            if (tradesTest(stock) && rangeTest(stock) && midDistanceTest(stock,stocksAlert)) {

                return true;
            }
        }
      
        function tradesTest(stock) {

            if (stock.tr_num > 500) {

                return true;
            }
        }
        function rangeTest(stock) {

            if (stock.hidiffloWhole > 1) {

                return true;
            }
        }
        function midDistanceTest(stock, stocksAlert) {

            if (stock.distance < .15) {
                testOFactory.stockAlert(stock, stocksAlert, 'testB', true);
            }else{
                testOFactory.stockAlert(stock, stocksAlert, 'testB', false);

            }

            return true;
        }
    }
})();
