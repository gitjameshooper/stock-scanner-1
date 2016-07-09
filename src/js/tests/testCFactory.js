(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testCFactory', testCFactory);
    testCFactory.$inject = ['$log'];

    function testCFactory($log) {
        return {
            scanStock: scanStock
        };

        function scanStock() {

             

        }
        
 
        
       
    }
})();