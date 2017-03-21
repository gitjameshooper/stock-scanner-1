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
            excludeETF: excludeETF,
            stockAlert: stockAlert

        };
        // check liquidity of stock throughout the day
        function volTest(stock, stockVolumeObj) {
            var dateHours = new Date().getHours(),
                dateMins = new Date().getMinutes();
            // if outside trading time use after 3pm/EOD volume
            if (dateHours > 15 || dateHours < 8) { dateHours = 15; }
            if (dateHours == 8 && dateMins >= 40) { dateMins = 40; } else { dateMins = ''; }
            if (dateHours == 8 && dateMins >= 50) { dateMins = 50; } else { dateMins = ''; }

            if (stock.vl >= stockVolumeObj['hr' + dateHours + dateMins]) {
                return true;
            }
        }

        function haltTest(stock) {

            if (stock.bid_time != "00:00") {
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
        // exclude etfs
        function excludeETF(stock, include, etfArr) {
            
                if (include || _.indexOf(etfArr, stock.symbol) < 0) {
                    return true;
                } 
            
        }
        // alert for stocks
        function stockAlert(stock, stocksArr, stockAdd) {
            var stockIndex = _.indexOf(stocksArr, stock.symbol);
            if (stockAdd && stockIndex < 0) {
                stock.class = 'green';
                stocksArr.push(stock.symbol);
                $.playSound("/sounds/alert");
            } else if (!stockAdd && stockIndex >= 0) {
                stocksArr.splice(stockIndex, 1);
            } else if (stockAdd) {
                stock.class = 'green';
            }
        }
    }
})();
