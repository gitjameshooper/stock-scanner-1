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
        function allTests(stock, stocksAlert, cfg) {
            if (aboveVWAP(stock) && poleHeight(stock) && vwapHeight(stock)) {
                return true;
            }
        }
        function vwapHeight(stock){  
            if(stock.hivwap > .30){

                return true;
            }
        }
        function poleHeight(stock){
            
            if(stock.pole > .60){

                return true;
            }
        }
        function aboveVWAP(stock){
            
            if(stock.last > stock.vwap){
                 
                return true;
            }
        }
    }
})();