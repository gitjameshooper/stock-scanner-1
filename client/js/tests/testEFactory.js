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
                "name" : "ash",
                "hi" : 63.00,
                "lo" : 62.00,
                "type" : "Buy"
            },{
                "name" : "sorl",
                "hi" : 5.75,
                "lo" : 5.40,
                "type" : "Buy"
            },{
                "name" : "wday",
                "hi" : 95.30,
                "lo" : 94.00,
                "type" : "buy"
            },{
                "name" : "alny",
                "hi" : 65.50,
                "lo" : 64.50,
                "type" : "Buy"
            },{
                "name" : "trvg",
                "hi" : 20.00,
                "lo" : 19.50,
                "type" : "Buy"
            },{
                "name" : "exas",
                "hi" : 32.50,
                "lo" : 32.00,
                "type" : "Buy"
            },{
                "name" : "qrvo",
                "hi" : 71.40,
                "lo" : 70.00,
                "type" : "Buy"
            },{
                "name" : "snap",
                "hi" : 20.50,
                "lo" : 20.00,
                "type" : "Buy"
            },{
                "name" : "htz",
                "hi" : 10.70,
                "lo" : 10.40,
                "type" : "Buy"
            },{
                "name" : "w",
                "hi" : 61.40,
                "lo" : 60.50,
                "type" : "Buy"
            },{
                "name" : "jwn",
                "hi" : 42.00,
                "lo" : 41.50,
                "type" : "short"
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
                   
                if(stock.symbol.toLowerCase() == stockSym.toLowerCase()){
                      
                    if(stockL < stock.last && stock.last < stockH){
                        stock.type = stockType;
                      return true;
                    }
                }
            }
        }
    }
})();