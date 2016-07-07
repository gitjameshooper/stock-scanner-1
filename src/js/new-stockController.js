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
                status: 'ready',
                run: true,
                apiMSecs: 900,
                symbolsPerTier: 350
            }
            // vars
        vm.symbolsJSON = {};
        vm.oAuthJSON = {};
        vm.symbolStr = '';
        vm.symbolsBegCount = 0;
        vm.symbolsCurCount = 0;
        vm.symbolsCurTier = 0;
        vm.symbolsTiers = [];

        // functions
        vm.startScan = startScan;
        vm.stopScan = stopScan;
        vm.getSymbols = getSymbols;
        vm.getOAuth = getOAuth;
        vm.checkData = checkData;
        vm.createTiers = createTiers;
        vm.formatSymbols = formatSymbols;
        vm.animations = animations;


        function getSymbols() {
            return symbolsService.getSymbols()
                .then(function(data) {
                    vm.symbolsJSON = data;
                    vm.getOAuth();
                });
        }

        function getOAuth() {
            return oAuthService.getOAuth()
                .then(function(data) {
                    vm.oAuthJSON = data;
                    vm.checkData();
                });
        }

        function checkData() {
            if (vm.symbolsJSON && vm.oAuthJSON) {
                vm.createTiers();
            } else {
                vm.cfg.status = "error";
            }
        }

        function createTiers() {
            var symbolCount = vm.symbolsJSON.length / vm.cfg.symbolsPerTier,
                symbolCountR = vm.symbolsJSON.length % vm.cfg.symbolsPerTier,
                tierStart = 0,
                tierEnd = vm.cfg.symbolsPerTier;

            for (var i = 1; i < symbolCount; i++) {
                vm.symbolsTiers.push([tierStart, tierEnd]);
                tierStart = tierEnd + 1;
                tierEnd += vm.cfg.symbolsPerTier;
            }
            if (symbolCountR !== 0) {
                vm.symbolsTiers.push([tierStart, symbolCountR + tierStart - 1]);
            }
            vm.formatSymbols();
        }

        function formatSymbols() {

            if (vm.cfg.run) {

                vm.symbolStr = '';
                vm.symbolsBegCount = 0;

                $.each(vm.symbolsJSON, function(k, v) {

                    if (vm.symbolsBegCount >= vm.symbolsTiers[vm.symbolsCurTier][0] && vm.symbolsTiers[vm.symbolsCurTier][0] <= vm.symbolsCurCount && vm.symbolsCurCount <= vm.symbolsTiers[vm.symbolsCurTier][1]) {
                        vm.symbolStr += v + ',';
                        vm.symbolsCurCount++;
                    }
                    vm.symbolsBegCount++;
                });

                vm.symbolsCurTier++;

                if (vm.symbolsCurTier >= vm.symbolsTiers.length) {
                    vm.symbolsCurTier = 0;
                    vm.symbolsCurCount = 0;
                };
                vm.symbolStr = vm.symbolStr.slice(0, -1);

                vm.oAuthJSON.tkRequestData.url = vm.oAuthJSON.tkRequestData.url + vm.symbolStr;
                setTimeout(function() {
                    // vm.callApi();
                }, vm.cfg.apiMSecs);
            }
        }
        function animations(){
            $(".slide-toggle").click(function() {
              var el = $(this).toggleClass('active').attr('data-toggle');

                $(el).slideToggle("slow", function() {

                });
            });
        }
        


        function startScan() {
            vm.cfg.run = true;
            vm.cfg.status = "scanning";
            vm.getSymbols();

        }

        function stopScan() {
            vm.cfg.run = false;
            vm.cfg.status = "stopped";
        }

        vm.animations();
    }
})();