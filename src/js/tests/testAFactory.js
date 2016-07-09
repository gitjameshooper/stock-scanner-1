(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testAFactory', testAFactory);
    testAFactory.$inject = ['$log'];

    function testAFactory($log) {
        return {
            scanStock: scanStock
        };

        function scanStock() {

             

        }
        
 
        
       
    }
})();