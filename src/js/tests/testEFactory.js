// Test Notes:  Used to find a morning push and pullback near vwap for entry to go long
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testEFactory', testEFactory);
    testEFactory.$inject = ['$log', 'testOFactory'];


    function testEFactory($log, testOFactory) {
        var oldSymbolsArr = [],
            newSymbolsArr = [],
            stockIndex = null;

        return {
            allTests: allTests

        };

        function allTests(stock, stocksAlert, stockSpeedPctE) {
            // check if the stock passes all the E Tests
            if (firstPassTest(stock) && speedTest(stock)) {
                return true;
            }
        }

        function firstPassTest(stock) {
            stockIndex = _.indexOf(oldSymbolsArr, stock.symbol);
            if (stockIndex < 0) {
                
                oldSymbolsArr.push(stock.symbol);
            }else{
                
          
                return true;
            }
        }
 

        function speedTest(stock) {
            window.console.log(stock.last + '---'+ oldSymbolsArr[stockIndex].last );
            return true;
            
        }

    }
})();