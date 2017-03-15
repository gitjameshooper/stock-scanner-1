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
        function allTests(stock, stocksAlert){
            var stockArr = [{
                "name" : "LJPC",
                "hi" : 34.00,
                "lo" : 33.00,
                "type" : "Buy"
            },{
                "name" : "MOMO",
                "hi" : 35.50,
                "lo" : 31.50,
                "type" : "Short"
            },{
                "name" : "ESPR",
                "hi" : 34.00,
                "lo" : 32.00,
                "type" : "Short"
            },{
                "name" : "SIG",
                "hi" : 69.00,
                "lo" : 67.00,
                "type" : "Buy"
            },{
                "name" : "CRCM",
                "hi" : 10.80,
                "lo" : 10.50,
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