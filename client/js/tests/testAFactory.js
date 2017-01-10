// Test Notes:  Used to find a morning push and pullback near vwap for entry to go long
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
        function allTests(stock, stocksAlert){
            var stockArr = [{
                "name" : "TWLO",
                "hi" : 32.00,
                "lo" : 27.00
            },{
                "name" : "EXAS",
                "hi" : 12.60,
                "lo" : 12.00
            },{
                "name" : "ARRY",
                "hi" : 9.62,
                "lo" : 9.38
            }];
            // check if the stock passes all the A Tests
            if (stockZoneTest(stock, stockArr)) {
                return true; 
            }
        }
        function stockZoneTest(stock, stockArr){
                var stockH,
                    stockL,
                    stockSym;

            for (var i = 0; i < stockArr.length; i++) { 
                    stockH = stockArr[i]['hi'];
                    stockL = stockArr[i]['lo'];
                    stockSym = stockArr[i]['name'];
                   
                if(stock.symbol == stockSym){
                      
                    if(stockL < stock.last && stock.last < stockH){
                      return true;
                    }
                }
            }
           
        }
        
    }
})();