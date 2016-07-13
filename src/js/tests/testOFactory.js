(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testOFactory', testOFactory);
    testOFactory.$inject = ['$log'];

    function testOFactory($log, stock) {
        return {
            volTest: volTest,
            priceTest: priceTest,
            delistTest: delistTest

        };
        // check liquidity of stock throughout the day
        function volTest(stock, stockVolumeObj) {
            var dateHours = new Date().getHours();
            // if outside trading time use after 3pm/EOD volume
            if (dateHours > 15 || dateHours < 8) { dateHours = 15; }
            if (stock.vl >= stockVolumeObj['hr' + dateHours]) {
                return true;
            }
        }
        // filter out stock by minimum price
        function priceTest(stock, stockMinPrice, stockMaxPrice) {
            
            if ((stock.last > stockMinPrice) && (stock.last < stockMaxPrice)) {
                return true;
            }
        }
        // check if stock has been added to delist
        function delistTest(stock, delistArr){

           if(_.indexOf(delistArr, stock.symbol) < 0){
            
              return true;
           }
        }
    }
})();