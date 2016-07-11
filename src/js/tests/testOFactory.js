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

        };

        function volTest(stock, stockVolumeObj) {
            var dateHours = new Date().getHours();
            // if outside trading time use after 3pm/EOD volume
            if (dateHours > 15 || dateHours < 8) { dateHours = 15; }
            if (stock.vl >= stockVolumeObj['hr' + dateHours]) {
                return true;
            }
        }

        function priceTest(stock) {
            
            if (stock.last >= 2) {
                return true;
            }
        }
    }
})();