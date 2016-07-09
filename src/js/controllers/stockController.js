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
                apiMSecs: 1100,
                symbolsPerTier: 300,
                stockDiffPctA: 6,
                stockAwayPctA: 2,
                stockRangePctB: 2, // price percentage range
                stockAwayPctB: .5, // price percentage away midpoint
                accountVal: 13000,
                stockVolumeObj: {
                "hr8": 300000,
                "hr9": 500000,
                "hr10": 800000,
                "hr11": 1000000,
                "hr12": 1200000,
                "hr13": 1400000,
                "hr14": 1600000,
                "hr15": 1600000
                }
            }
        // vars
        vm.tkUrl = '';
        vm.symbolsJSON = {};
        vm.oAuthJSON = {};
        vm.symbolStr = '';
        vm.symbolsBegCount = 0;
        vm.symbolsCurCount = 0;
        vm.symbolsCurTier = 0;
        vm.symbolTiers = [];
        vm.stocksPassed ={
                stocksPassA :[],
                stocksPassB : []
              }
        vm.stocksA = [];
        vm.stocksB = [];

        // functions
        vm.startScan = startScan;
        vm.stopScan = stopScan;
        vm.getSymbols = getSymbols;
        vm.getStocks = getStocks;
        vm.getOAuth = getOAuth;
        vm.checkData = checkData;
        vm.createTiers = createTiers;
        vm.formatSymbols = formatSymbols;
        vm.viewStocks = viewStocks;
        vm.scanStocks = scanFactory.scanStocks;
        vm.removeStock = scanFactory.removeStock;
        vm.removeAllStocks = scanFactory.removeAllStocks;
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
                //run tk data thru tests
                vm.stocksPassed = vm.scanStocks(data.response.quotes.quote, vm.cfg.accountVal, vm.cfg.stockVolumeObj, vm.stocksPassed, vm.cfg.stockDiffPctA, vm.cfg.stockAwayPctA, vm.cfg.stockRangePctB, vm.cfg.stockAwayPctB);
                vm.viewStocks();
            });    
        }
        function viewStocks(){
            // empty arrays after going thru all tiers
            if (vm.symbolsCurTier === 0) {

                // play sound if vwamp stock found
                // if (vm.stocksCTierfin.length != vm.cfg.soundCount) {
                //     $.playSound("http://www.noiseaddicts.com/samples_1w72b820/3739");
                //     vm.cfg.soundCount = vm.stocksCTierFin.length;
                // }

                 
                vm.stocksA = vm.stocksPassed.stocksPassA;
                vm.stocksB = vm.stocksPassed.stocksPassB;
                // vm.stocksC = vm.stocksCTierFin;
                // vm.stocksCOTier = vm.stocksCTier;
                $scope.$apply();
                //empty tiers
                vm.stocksPassed.stocksPassA = [];
                vm.stocksPassed.stocksPassB = [];
                // vm.stocksCTier = [];

            }
            //  Create loop
            vm.formatSymbols();
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
                vm.symbolTiers.push([tierStart, tierEnd]);
                tierStart = tierEnd + 1;
                tierEnd += vm.cfg.symbolsPerTier;
            }

            if (symbolCountR !== 0) {
                vm.symbolTiers.push([tierStart, symbolCountR + tierStart - 1]);
            }
            vm.formatSymbols();
        }

        function formatSymbols() {
            if (vm.cfg.run) {

                vm.symbolStr = '';
                vm.symbolsBegCount = 0;

                // cycle thru symbols in a tier
                $.each(vm.symbolsJSON, function(k, v) {

                    if (vm.symbolsBegCount >= vm.symbolTiers[vm.symbolsCurTier][0] && vm.symbolTiers[vm.symbolsCurTier][0] <= vm.symbolsCurCount && vm.symbolsCurCount <= vm.symbolTiers[vm.symbolsCurTier][1]) {
                        vm.symbolStr += k + ',';
                        vm.symbolsCurCount++;
                    }
                    vm.symbolsBegCount++;
                });

                vm.symbolsCurTier++;
               
                if (vm.symbolsCurTier >= vm.symbolTiers.length) {
                    vm.symbolsCurTier = 0;
                    vm.symbolsCurCount = 0;
                };
                vm.symbolStr = vm.symbolStr.slice(0, -1);
                window.console.log(vm.symbolsCurTier);
                vm.tkUrl = vm.oAuthJSON.tkRequestData.url + vm.symbolStr;
                setTimeout(function() {
                    vm.getStocks(vm.tkUrl, vm.oAuthJSON.tkRequestData.method, vm.oAuthJSON.consumer.authorize(vm.oAuthJSON.tkRequestData, vm.oAuthJSON.token));
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