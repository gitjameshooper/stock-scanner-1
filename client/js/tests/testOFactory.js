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
            haltTest: haltTest,
            delistTest: delistTest,
            stockAlert: stockAlert

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
        function haltTest(stock) {
              
            if (stock.prchg > 0 && stock.bid > 0) {
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
        function delistTest(stock, delistArr) {

            if (_.indexOf(delistArr, stock.symbol) < 0) {

                return true;
            }
        }

        function stockAlert(stock, stocksArr, stockAdd) {
            var stockIndex = _.indexOf(stocksArr, stock.symbol);
            if (stockAdd && stockIndex < 0) {
                stock.class = 'green';
                stocksArr.push(stock.symbol);
                $.playSound("/sounds/evil-laugh");
            } else if (!stockAdd && stockIndex >= 0) {
                stocksArr.splice(stockIndex, 1);
            } else if (stockAdd) {
                stock.class = 'green';
            }
        }
    }
})();