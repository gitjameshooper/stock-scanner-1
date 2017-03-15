// Test Notes:  Used to find a Swing Stocks
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testGFactory', testGFactory);
    testGFactory.$inject = ['$log', 'testOFactory'];

    function testGFactory($log, testOFactory) {
         return {
            allTests: allTests

        };
        // check if the stock passes all the Tests
        function allTests(stock, stocksAlert, cfg) {
            console.log(stock);
            if (priorDayCandle(stock)) {
                return true;
            }
        }

            // stock.lo = Math.round(stock.lo * 100) / 100;
            // stock.hi = Math.round(stock.hi * 100) / 100;
              // stock.opn = Math.round(stock.opn * 100) / 100;
            // stock.last = Math.round(stock.last * 100) / 100;
          
          

            // stock.plo = Math.round(stock.plo * 100) / 100;
            // stock.phi = Math.round(stock.phi * 100) / 100;
            // stock.popn = Math.round(stock.popn * 100) / 100;
            // stock.pcls = Math.round(stock.pcls * 100) / 100;
         
        function priorDayCandle(stock){  
            var priorDayCandleDiff = stock.popn - stock.pcls,
                currentDayCandleDiff = stock.opn - stock.last,
                range = .60;
                
                stock.candleHeight = priorDayCandleDiff + currentDayCandleDiff;
            

                if(priorDayCandleDiff < 0){
                    if(priorDayCandleDiff < (-1 * range) &&  currentDayCandleDiff > range){
                        return true;
                         
                    }
                }else if(currentDayCandleDiff < 0){
                    if(priorDayCandleDiff > range &&  currentDayCandleDiff < (-1 * range)){
                        return true;
                         
                    }
                }
    
        }   
    }
})();