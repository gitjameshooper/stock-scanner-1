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
                "name" : "zoes"
            },{
                "name" : "deck"
            },{
                "name" : "ntnx"
            },{
                "name" : "splk"
            },{
                "name" : "trgp"
            },{
                "name" : "veev"
            },{
                "name" : "gme"
            },{
                "name" : "bby"
            },{
                "name" : "sig"
            },{
                "name" : "alxn"
            },{
                "name" : "afsi"
            }];
            // check if the stock passes all the E Tests
            if (stockMidTest(stock, stockArr)) {
                return true; 
            }
        }
        function stockMidTest(stock, stockArr){
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
                      
        
                    return true;
                    
                }
            }
        }
    }
})();