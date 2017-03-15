(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('symbolsService', symbolsService);
    symbolsService.$inject = ['$http', '$log'];

    function symbolsService($http, $log) {
        return {
            getSymbols: getSymbols,
            getSymbolsString: getSymbolsString
        };

        function getSymbols() {
            return $http.get('/json/symbols.json')
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
        function getSymbolsString(symbolsJSON){
            var symbolStr = '';
             
            $.each(symbolsJSON, function(k, v) {
                
                if(v.symbol){
                 symbolStr += v.symbol + ',';
                }                    
            });
            return symbolStr;
        }
    }
})();