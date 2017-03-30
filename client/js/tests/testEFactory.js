// Test Notes:  Used to find stocks for INVESTORS LIVE
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testEFactory', testEFactory);
    testEFactory.$inject = ['$log', 'testOFactory'];

    function testEFactory($log, testOFactory) {
        return {
            allTests: allTests
        
        };
        function allTests(stock, cfg){
            var stockArr = [{
                "name" : "APOP",
                "hi" : 9.40,
                "lo" : 7.00,
                "type" : "Buy"
            },{
                "name" : "CNCE",
                "hi" : 18.20,
                "lo" : 17.00,
                "type" : "Buy"
            },{
                "name" : "AAOI",
                "hi" : 502.00,
                "lo" : 500.00,
                "type" : "Buy"
            }];
            // check if the stock passes all the E Tests
            if (stockZoneTest(stock, stockArr)) {
                return true; 
            }
        }
        function stockZoneTest(stock, stockArr){
                var stockH,
                    stockL,
                    stockSym,
                    stockType;

            for (var i = 0; i < stockArr.length; i++) { 
                    stockH = stockArr[i]['hi'];
                    stockL = stockArr[i]['lo'];
                    stockSym = stockArr[i]['name'];
                    stockType = stockArr[i]['type'];
                   
                if(stock.symbol == stockSym){
                      
                    if(stockL < stock.last && stock.last < stockH){
                        stock.type = stockType;
                      return true;
                    }
                }
            }
        }
    }
})();