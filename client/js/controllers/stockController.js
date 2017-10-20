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
                callOnce: true,
                apiMSecs: 1500,
                includeETF: false,
                etfArr: ["EUFN","NEAR","RING","OIL","PFF","PHB","PGX","QID","EWG","JNK","EEM","DFJ", "TVIX", "FEZ", "XRT", "RSX", "DXD", "INDA", "USMV", "TBT", "LABU", "LABD", "HEDJ", "EPI", "BKLN", "VTV", "ITB", "XLU", "HEZU", "YINN", "VMBS", "EFV", "NUGT", "JNUG", "EDZ", "DPK", "SJNK", "OIH", "SQQQ", "XOP", "ERY", "USLV", "FAZ", "UVXY", "VIXY", "PDBC", "CATH", "VXX", "UWTI", "DWTI", "DGAZ", "DUST", "XIV", "TZA", "DBEF", "DBJP", "UGAZ", "SPXS", "XIV", "XOP", "GDX", "SVXY", "JDST"],
                stockMinPrice: 2,
                stockMaxPrice: 100,
                stockGapPctA: 5,
                stockVwapPctB: 5, // price percentage away from vwap
                stockVwapHighPctB: 10, // high percentage away from vwap
                stockSpeedPctC: 2,
                stockSpeedHighPctC: 3,
                stockMaxSpreadC: .50,
                loopCounter: 0,
                loopCycles: 30,
                stocksAlert: [],
                loopArr1: [],
                stockMinFloatRotated: .50,
                accountVal: 55000,
                testing: false, // used for testing after hours
                showTest: {
                    testA: true, // volume test
                    testB: true, // secondary volume Test
                    testC: false, // Speed Test
                    testD: false, // Float Test
                    testE: true, // Mid Volume Test
                    testG: false, // Swing Test
                    testH: false // ABCD Test
                },
                stockMinVolume: 100000,
                stockVolumeObj: {
                    "hr8": 200000,
                    "hr840": 400000,
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
            stocksPassE: [],
            stocksPassG: [],
            stocksPassH: []
        }
        vm.stocksA = [];
        vm.stocksB = [];
        vm.stocksC = [];
        vm.stocksD = [];
        vm.stocksE = [];
        vm.stocksG = [];
        vm.stocksH = [];

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
        vm.emptyLocalStorage = scanFactory.emptyLocalStorage;
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
            oAuthData.symbols = vm.symbolsStr;

            $.ajax({
                url: url,
                type: method,
                data: oAuthData,
            }).error(function(err) {
                vm.cfg.status = "error";
                vm.cfg.run = false;
                $.playSound("/sounds/monkey");
                $log.error('Bad TK Request - ' + err.statusText);
                $scope.$apply();
                // start scan if error
                setTimeout(function() {
                    vm.startScan();
                }, 10000);

            }).done(function(data) {

                // call these functions once after first data from api
                if (vm.cfg.callOnce) {

                    //  Overwrite symbol string and filter all the stocks with no volume for smaller api calls
                    vm.symbolsStr = '';
                    $.each(data.response.quotes.quote, function(k, stock) {

                        if (stock.vl > vm.cfg.stockMinVolume) {
                            vm.symbolsStr += stock.symbol + ',';
                        }

                    });
                    vm.cfg.callOnce = false;
                }
                // Start - speed test ONLY
                vm.cfg.loopCounter++;

                if (vm.cfg.loopCounter === (vm.cfg.loopCycles + 1)) {
                    vm.cfg.loopCounter = 1;
                    vm.cfg.loopArr1 = [];
                }
                // End - speed test ONLY
                if (vm.cfg.run) {
                    setTimeout(function() {
                        vm.getStockData(vm.oAuthJSON.tkRequestData.url, vm.oAuthJSON.tkRequestData.method, vm.oAuthJSON.consumer.authorize(vm.oAuthJSON.tkRequestData, vm.oAuthJSON.token));

                        //run tk stock data thru tests and push to view
                        vm.stocksPassed = vm.scanStocks(data.response.quotes.quote, vm.stocksPassed, vm.symbolsJSON, vm.cfg);
                        vm.viewStocks();

                    }, vm.cfg.apiMSecs);
                }
            });
        }

        function viewStocks() {

            // Start - speed test ONLY
            if (vm.cfg.loopCounter == vm.cfg.loopCycles) {
                vm.stocksC = [];
            }
            // End - speed test ONLY

            // pass stocks that passed the tests to final arrays for the view
            vm.stocksA = vm.stocksPassed.stocksPassA;
            vm.stocksB = vm.stocksPassed.stocksPassB;
            vm.stocksC = vm.stocksC.concat(vm.stocksPassed.stocksPassC);
            vm.stocksD = vm.stocksPassed.stocksPassD;
            vm.stocksE = vm.stocksPassed.stocksPassE;
            vm.stocksG = vm.stocksPassed.stocksPassG;
            vm.stocksH = vm.stocksPassed.stocksPassH;
            $scope.$apply();

            //reset stocks passed arrays
            vm.stocksPassed = {
                stocksPassA: [],
                stocksPassB: [],
                stocksPassC: [],
                stocksPassD: [],
                stocksPassE: [],
                stocksPassG: [],
                stocksPassH: []
            }
        }

        function startScan() {
            vm.cfg.run = true;
            vm.cfg.callOnce = true;
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
