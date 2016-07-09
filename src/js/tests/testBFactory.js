(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testBFactory', testBFactory);
    testBFactory.$inject = ['$log'];

    function testBFactory($log) {
        return {
            scanStock: scanStock
        };

        function scanStock() {

             

        }
        
 
        
       
    }
})();