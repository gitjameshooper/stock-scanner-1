(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('symbolsService', symbolsService);
    symbolsService.$inject = ['$http', '$log'];

    function symbolsService($http, $log) {
        return {
            getSymbols: getSymbols
        };

        function getSymbols() {
            return $http.get('/json/sample-symbols.json')
                .then(getSymbolsDone)
                .catch(getSymbolsFail);
        }

        function getSymbolsDone(response) {
            return response.data;
        }

        function getSymbolsFail(error) {
            $log.error('Failed to get Symbols - ' + error.statusText);
            return false;
        }
    }
})();