(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('tkService', tkService);
    tkService.$inject = ['$http', '$log'];

    function tkService($http, $log) {
        return {
            getStockData: getStockData
        };

        function getStockData(url, method, oAuthData) {
            
            
             
        }

        function getStockDone(response) {
            return response.data;
        }

        function getStockFail(error) {
            $log.error('Failed to get Stock - ' + error.statusText);
            return false;
        }
    }
})();