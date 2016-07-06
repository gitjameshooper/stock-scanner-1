(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .controller('stockController', stockController);
    stockController.$inject = ['$scope', 'symbolsService', 'oAuthService'];

    function stockController($scope, symbolsService, oAuthService) {
        var vm = this;
        // config
        vm.cfg = {
            symbolsJSON: {},
            run: true
        }
        vm.getData = getData;
        vm.status = 'Ready';
        
        function getData() {
             
            vm.cfg.symbolsJSON = symbolsService.getSymbols();
            vm.cfg.tkOAuth = oAuthService.getOAuth();
            return symbolsService.getSymbols()
            .then(function(data){
                window.console.log(data);
            });
    
                     
        }
        getData();
      
        function startScan() {
            vm.cfg.run = true;
            vm.getData();
            vm.class = "green";
            vm.status = "Scanning";
        }

        function stopScan() {
            vm.cfg.run = false;
            vm.class = "red";
            vm.status = "Stopped";
        }
      
    }
})();