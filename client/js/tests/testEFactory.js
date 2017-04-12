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
                "name" : "TSLA",
                "hi" : 115.00,
                "lo" : 105.00,
                "type" : "Short"
            },{
                "name" : "VRTX",
                "hi" : 111.50,
                "lo" : 109.00,
                "type" : "Buy"
            },{
                "name" : "CRCM",
                "hi" : 12.30,
                "lo" : 12.00,
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