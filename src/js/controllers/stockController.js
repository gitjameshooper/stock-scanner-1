(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .controller('stockController', stockController);
    stockController.$inject = ['$scope', '$log', 'symbolsService', 'oAuthService', 'xtraFactory','scanFactory'];

    function stockController($scope, $log, symbolsService, oAuthService, xtraFactory, scanFactory) {
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
        vm.getStocks = getStocks;
        vm.getOAuth = getOAuth;
        vm.checkData = checkData;
        vm.createTiers = createTiers;
        vm.formatSymbols = formatSymbols;
        vm.removeStock = scanFactory.removeStock(stock, stocksArr);
        vm.removeAllStocks = scanFactory.removeAllStocks(stocksArr);
        vm.init = init;

        function init(){
            xtraFactory.settingsAnim();
            xtraFactory.jQueryExtends();
        }

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

        function getStocks(url, method, oAuthData) {
             $.ajax({
                url: url,
                type: method,
                data: oAuthData,
                beforeSend: function(xhr, settings) {
                    // hijack request url and remove duplicate symbols from oAuth
                    var symbolStr = settings.url.indexOf('&symbols=');
                    var oauthStr = settings.url.indexOf('&oauth_signature=');
                    var rmString = settings.url.substring(symbolStr, oauthStr);
                    settings.url = settings.url.replace(rmString, '');
                }

            }).error(function(err) {
                vm.cfg.status = "error";
                $log.error('Bad TK Request - ' + err.statusText);
                $scope.$apply();
                
            }).done(function(data) {
                vm.cfg.status = "scanning";
                // set date var
                vm.dateHours = new Date().getHours();
                //run tk data thru tests
                vm.quoteScan(data.response.quotes.quote);
       
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
            var symbolCount = Object.keys(vm.symbolsJSON).length / vm.cfg.symbolsPerTier,
                symbolCountR = Object.keys(vm.symbolsJSON).length % vm.cfg.symbolsPerTier,
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

                // cycle thru symbols in a tier
                $.each(vm.symbolsJSON, function(k, v) {

                    if (vm.symbolsBegCount >= vm.symbolsTiers[vm.symbolsCurTier][0] && vm.symbolsTiers[vm.symbolsCurTier][0] <= vm.symbolsCurCount && vm.symbolsCurCount <= vm.symbolsTiers[vm.symbolsCurTier][1]) {
                        vm.symbolStr += k + ',';
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
                    vm.getStocks(vm.oAuthJSON.tkRequestData.url, vm.oAuthJSON.tkRequestData.method, vm.oAuthJSON.consumer.authorize(vm.oAuthJSON.tkRequestData, vm.oAuthJSON.token));
                }, vm.cfg.apiMSecs);
            }
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

        vm.init();
    }
})();