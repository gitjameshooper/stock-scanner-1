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
                "name" : "SNAP",
                "hi" : 25.50,
                "lo" : 24.00,
                "type" : "Short"
            },{
                "name" : "AAOI",
                "hi" : 55.00,
                "lo" : 50.00,
                "type" : "Short"
            },{
                "name" : "DKS",
                "hi" : 51.50,
                "lo" : 50.00,
                "type" : "Short"
            },{
                "name" : "SIG",
                "hi" : 72.50,
                "lo" : 64.00,
                "type" : "Short"
            }];
            // check if the stock passes all the E Tests
             
            if(stock.symbol === 'AAOI'){
                console.log(stock);
            }
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