// Test Notes:  Used to find Flag stocks
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
        function allTests(stock, cfg) {
            if (volTest(stock) && midTest(stock) && rangeTest(stock)) {
                return true;
            }
        }

        function volTest(stock) {

            if (stock.volDay > .10) {

                return true;
            }
        }

        function midTest(stock) {
            var priceDiff = .25;
            if (stock.last < 10) {
                priceDiff = .15;
            } else if (stock.last < .20) {
                priceDiff = .20;

            }

            if ((stock.mid + priceDiff) > stock.last && (stock.mid - priceDiff) < stock.last) {
                return true;
            }
        }

        function rangeTest(stock) {
            
            if (stock.hidifflo > .30) {
                return true;
            }
        }
    }
})();
