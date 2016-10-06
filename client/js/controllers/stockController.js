(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .controller('stockController', stockController);
    stockController.$inject = ['$scope', '$log', 'symbolsService', 'oAuthService', 'xtraFactory', 'scanFactory', 'tierFactory'];

    function stockController($scope, $log, symbolsService, oAuthService, xtraFactory, scanFactory, tierFactory) {
        var vm = this;
        // config
        vm.cfg = {
                status: 'ready',
                run: true,
                apiMSecs: 800,
                symbolsPerTier: 340,
                loopCounter: 0,
                stockMinPrice: 2,
                stockMaxPrice: 100,
                stockDiffPctA: 5,
                stockVwapPctB: 8, // price percentage away from vwap
                stockVwapHighPctB: 12, // high percentage away from vwap
                stockPriorDayPctC: 5,
                stockSpeedPctE: 1,
                stockSpeedHighPctE: 2,
                stockMaxSpreadE: .20,
                accountVal: 8000,
                showTest: {
                    testA: true,
                    testB: false,
                    testC: true,
                    testD: true,
                    testE: false,
                    testF: true
                },
                stockVolumeObj: {
                    "hr8": 200000,
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
        vm.stocksPassed = {
            stocksPassA: [],
            stocksPassB: [],
            stocksPassC: [],
            stocksPassD: [],
            stocksPassE: [],
            stocksPassF: [],
            stocksAlert: []
        }
        vm.stocksA = [];
        vm.stocksB = [];
        vm.stocksC = [];
        vm.stocksD = [];
        vm.stocksE = [];
        vm.stocksF = [];

        // functions
        vm.startScan = startScan;
        vm.stopScan = stopScan;
        vm.getSymbols = getSymbols;
        vm.getStocks = getStocks;
        vm.getOAuth = getOAuth;
        vm.checkData = checkData;
        vm.createTiers = tierFactory.createTiers;
        vm.formatTierSymbols = tierFactory.formatTierSymbols;
        vm.loopTiers = loopTiers;
        vm.viewStocks = viewStocks;
        vm.scanStocks = scanFactory.scanStocks;
        vm.delistStock = scanFactory.delistStock;
        vm.init = init;

        function init() {

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
            window.console.log('oauth');
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
                $.playSound("/sounds/monkey");
                $log.error('Bad TK Request - ' + err.statusText);
                $scope.$apply();
                // start scan if error
                setTimeout(function() {
                    vm.startScan();
                }, 10000);

            }).done(function(data) {
                //run tk data thru tests
                vm.stocksPassed = vm.scanStocks(data.response.quotes.quote, vm.stocksPassed, vm.cfg);
                vm.viewStocks();
            });
        }

        function viewStocks() {

            // pass final arrays to view
            vm.stocksA = vm.stocksPassed.stocksPassA;
            vm.stocksB = vm.stocksPassed.stocksPassB;
            vm.stocksC = vm.stocksPassed.stocksPassC;
            vm.stocksD = vm.stocksPassed.stocksPassD;
            vm.stocksE = vm.stocksPassed.stocksPassE;
            vm.stocksF = vm.stocksPassed.stocksPassF;

            $scope.$apply();

            //  keep looping thru tiers
            vm.loopTiers();
        }

        function checkData() {
            if (vm.symbolsJSON && vm.oAuthJSON) {
                // create tiers and start the loop
                vm.symbolTiers = vm.createTiers(vm.symbolsJSON, vm.cfg.symbolsPerTier);
                vm.loopTiers();
            } else {
                vm.cfg.status = "error";
                $.playSound("/sounds/monkey");
            }
        }

        function loopTiers() {
            if (vm.cfg.run) {
                vm.tkUrl = vm.formatTierSymbols(vm.symbolsJSON, vm.symbolTiers, vm.oAuthJSON, vm.cfg);
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