// Test Notes:  Used to find stocks with float rotation
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testDFactory', testDFactory);
    testDFactory.$inject = ['$log', 'testOFactory'];

    function testDFactory($log, testOFactory) {
        return {
            allTests: allTests

        };

        function allTests(stock, cfg) {  
            // check if the stock passes all the Tests
            if (nanStock(stock) && stockFloat(stock, cfg.stockMinFloatRotated)) {
                return true;
            }
        }
        function nanStock(stock){
            if(!isNaN(stock.float)){
                return true;
            }
        }
        function stockFloat(stock, stockMinFloatRotated ){

            if(stock.floatRotated > stockMinFloatRotated){

                return true;
            }
        }
    }
})();