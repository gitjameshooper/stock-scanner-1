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
                "name" : "TWLO",
                "hi" : 32.00,
                "lo" : 27.00,
                "type" : "RG"
            },{
                "name" : "EXAS",
                "hi" : 12.60,
                "lo" : 12.00,
                "type" : "Para"
            },{
                "name" : "ARRY",
                "hi" : 9.62,
                "lo" : 9.38,
                "type" : "RG"
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