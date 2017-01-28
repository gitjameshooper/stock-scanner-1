(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .controller('stockController', stockController);
    stockController.$inject = ['$scope', '$log', 'symbolsService', 'oAuthService', 'xtraFactory', 'scanFactory'];
     
    function stockController($scope, $log, symbolsService, oAuthService, xtraFactory, scanFactory) {
        var vm = this;
        // config
        vm.cfg = {
                status: 'ready',
                run: true,
                apiMSecs: 2000,
                etfArr: ["NUGT","JNUG","EDZ","DPK","SJNK","OIH","SQQQ","XOP","ERY","USLV","FAZ","UVXY","VIXY","PDBC","CATH","VXX","UWTI","DWTI","DGAZ","DUST","XIV","TZA","DBEF","DBJP","UGAZ","SPXS","XIV","XOP","GDX","SVXY","JDST"],
                loopCounter: 0,
                stockMinPrice: 2,
                stockMaxPrice: 100,
                stockGapPctA: 5,
                stockVwapPctB: 5, // price percentage away from vwap
                stockVwapHighPctB: 12, // high percentage away from vwap
                stockSpeedPctC: 1,
                stockMaxSpreadC: .75,
                stockMinFloatRotated: .80,
                accountVal: 24000,
                showTest: {
                    testA: true,
                    testB: true,
                    testC: true,
                    testD: true
                },
                stockVolumeObj: {
                    "hr8": 200000,
                    "hr840": 300000,
                    "hr850": 500000,
                    "hr9": 600000,
                    "hr10": 800000,
                    "hr11": 1000000,
                    "hr12": 1200000,
                    "hr13": 1400000,
                    "hr14": 1600000,
                    "hr15": 1600000
                }
            }
        // vars
        vm.oAuthJSON = {};
        vm.symbolsStr = '';
        vm.symbolsJSON = {};
        vm.stocksPassed = {
            stocksPassA: [],
            stocksPassB: [],
            stocksPassC: [],
            stocksPassD: [],
            stocksAlert: []
        }
        vm.stocksA = [];
        vm.stocksB = [];
        vm.stocksC = [];
        vm.stocksD = [];

        // functions
        vm.startScan = startScan;
        vm.stopScan = stopScan;
        vm.getOAuth = getOAuth;
        vm.getSymbols = getSymbols;
        vm.getStockData = getStockData;
        vm.viewStocks = viewStocks;
        vm.scanStocks = scanFactory.scanStocks;
        vm.delistStock = scanFactory.delistStock;
        vm.emptyDelist = scanFactory.emptyDelist;
        vm.init = init;

        function init() {
            xtraFactory.settingsAnim();
            xtraFactory.jQueryExtends();
        }
        function getSymbols() {
            return symbolsService.getSymbols()
                .then(function(data) {
                    vm.symbolsJSON = data;
                    vm.symbolsStr = symbolsService.getSymbolsString(vm.symbolsJSON);
                    vm.getOAuth();
                });
        }
        function getOAuth() {
            return oAuthService.getOAuth()
                .then(function(data) {
                    vm.oAuthJSON = data;
                    vm.getStockData(vm.oAuthJSON.tkRequestData.url, vm.oAuthJSON.tkRequestData.method, vm.oAuthJSON.consumer.authorize(vm.oAuthJSON.tkRequestData, vm.oAuthJSON.token));
                });
        }
        function getStockData(url, method, oAuthData) {
            // add symbols to data with oAuth
             
            oAuthData.symbols =  vm.symbolsStr;
            
            $.ajax({
                url: url,
                type: method,
                data: oAuthData,
                 beforeSend: function(xhr, settings) {
                                if (vm.cfg.run) {
                setTimeout(function() {
                    vm.getStockData(vm.oAuthJSON.tkRequestData.url, vm.oAuthJSON.tkRequestData.method, vm.oAuthJSON.consumer.authorize(vm.oAuthJSON.tkRequestData, vm.oAuthJSON.token));
                }, vm.cfg.apiMSecs);
            }
                   
                }
            }).error(function(err) {
                vm.cfg.status = "error";
                vm.cfg.run = false;
                // $.playSound("/sounds/monkey");
                $log.error('Bad TK Request - ' + err.statusText);
                $scope.$apply();
                // start scan if error
                // setTimeout(function() {
                //     vm.startScan();
                // }, 20000);

            }).done(function(data) {
                //run tk data thru tests
                console.log('hey');
                vm.stocksPassed = vm.scanStocks(data.response.quotes.quote, vm.stocksPassed, vm.symbolsJSON, vm.cfg);
                vm.viewStocks();

            });

        }

        function viewStocks() {

            // pass final arrays to view
            vm.stocksA = vm.stocksPassed.stocksPassA;
            vm.stocksB = vm.stocksPassed.stocksPassB;
            vm.stocksC = vm.stocksPassed.stocksPassC;
            vm.stocksD = vm.stocksPassed.stocksPassD;
            
            $scope.$apply();
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