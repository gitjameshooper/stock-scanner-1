(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testVolFactory', testVolFactory);
    testVolFactory.$inject = ['$log'];

    function testVolFactory($log, stock) {
        return {
            volTest: volTest

        };

        function volTest(stock, stockVolumeObj) {
            var dateHours = new Date().getHours();
            // if outside trading time use after 3/EOD volume
            if (dateHours > 15 || dateHours < 8) { dateHours = 15; }
            if (stock.vl >= stockVolumeObj['hr' + dateHours]) {
                return true;
            }
        }
    }
})();