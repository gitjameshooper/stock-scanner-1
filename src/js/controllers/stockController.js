(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .controller('stockController', stockController);
    stockController.$inject = ['$scope', '$log', 'symbolsService', 'oAuthService', 'xtraFactory','scanFactory', 'tierFactory'];

    function stockController($scope, $log, symbolsService, oAuthService, xtraFactory, scanFactory, tierFactory) {
        var vm = this;
        // config
        vm.cfg = {
                status: 'ready',
                run: true,
                apiMSecs: 600,
                symbolsPerTier: 340,
                stockDiffPctA: 6,
                stockVwapBoxPctA: 2,
                stockRangePctB: 2, // price percentage range
                stockAwayPctB: .5, // price percentage away midpoint
                stockSpreadC: .10,
                stockFastC: 1.5, // price percentage change 
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
        vm.symbolTiers = [];
        vm.symbolStr = '';
        vm.stocksPassed ={
                stocksPassA :[],
                stocksPassB : [],
                stocksPassC : [],
                stocksPassCNow : [],
                stocksPassCPast : []
              }
        vm.stocksA = [];
        vm.stocksB = [];
        vm.stocksC = [];

        // functions
        vm.startScan = startScan;
        vm.stopScan = stopScan;
        vm.getSymbols = getSymbols;
        vm.getStocks = getStocks;
        vm.getOAuth = getOAuth;
        vm.checkData = checkData;
        vm.createTiers = tierFactory.createTiers;
        vm.formatTierSymbols = tierFactory.formatTierSymbols;
        vm.allTiersComplete = tierFactory.allTiersComplete;
        vm.loopTiers = loopTiers;
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
                vm.stocksPassed = vm.scanStocks(data.response.quotes.quote, vm.cfg.accountVal, vm.cfg.stockVolumeObj, vm.stocksPassed, vm.cfg.stockDiffPctA, vm.cfg.stockVwapBoxPctA, vm.cfg.stockRangePctB, vm.cfg.stockAwayPctB, vm.cfg.stockSpreadC, vm.cfg.stockFastC);
                vm.viewStocks();
            });    
        }
        function viewStocks(){
            // empty arrays after going thru all tiers
            if (vm.allTiersComplete()) {
                // pass final arrays to view
                vm.stocksA = vm.stocksPassed.stocksPassA;
                vm.stocksB = vm.stocksPassed.stocksPassB;
                // vm.stocksC = vm.stocksPassed.stocksPassC;
                // vm.stocksPassed.stocksPassCPast = vm.stocksPassed.stocksPassCNow;
                $scope.$apply();

                //empty symbols from arrays
                vm.stocksPassed.stocksPassA = [];
                vm.stocksPassed.stocksPassB = [];
                // vm.stocksPassed.stocksPassCNow = [];

            }
            //  Create loop
            vm.loopTiers();
        }

        function checkData() {
            if (vm.symbolsJSON && vm.oAuthJSON) {

                vm.symbolTiers = vm.createTiers(vm.symbolsJSON, vm.cfg.symbolsPerTier);
                vm.loopTiers();
            } else {
                vm.cfg.status = "error";
            }
        }

        function loopTiers() {
            if (vm.cfg.run) {
                vm.tkUrl = vm.formatTierSymbols(vm.symbolsJSON,vm.symbolTiers, vm.oAuthJSON);
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