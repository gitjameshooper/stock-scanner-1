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
                apiMSecs: 1000,
                etfArr: ["DFJ","TVIX","FEZ","XRT","RSX","DXD","INDA","USMV","TBT","LABU","LABD","HEDJ","EPI","BKLN","VTV","ITB","XLU","HEZU","YINN","VMBS","EFV","NUGT","JNUG","EDZ","DPK","SJNK","OIH","SQQQ","XOP","ERY","USLV","FAZ","UVXY","VIXY","PDBC","CATH","VXX","UWTI","DWTI","DGAZ","DUST","XIV","TZA","DBEF","DBJP","UGAZ","SPXS","XIV","XOP","GDX","SVXY","JDST"],
                stockMinPrice: 2,
                stockMaxPrice: 90,
                stockGapPctA: 5,
                stockVwapPctB: 5, // price percentage away from vwap
                stockVwapHighPctB: 10, // high percentage away from vwap
                stockSpeedPctC: 1,
                stockSpeedHighPctC: 3,
                stockMaxSpreadC: .50,
                loopCounter: 0,
                loopCycles: 30,
                loopArr1: [],
                stockMinFloatRotated: .50,
                accountVal: 27000,
                showTest: {
                    testA: true,  // Flag test
                    testB: false,  // Vwap Test
                    testC: false,  // Speed Test
                    testD: false,  // Float Test
                    testE: true,   // Investors Live Test
                    testG: false   // Swing Test
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
            stocksAlert: []
        }
        vm.stocksA = [];
        vm.stocksB = [];
        vm.stocksC = [];
        vm.stocksD = [];
        vm.stocksE = [];
        vm.stocksG = [];

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
              
                // call these functions once
                if(vm.cfg.callOnce){
                    // start the interval scanning based of active AJAX requests  
                    // setInterval(function(){
                    //     if (vm.cfg.run &&  $.active < 2) {          
                    //         vm.getStockData(vm.oAuthJSON.tkRequestData.url, vm.oAuthJSON.tkRequestData.method, vm.oAuthJSON.consumer.authorize(vm.oAuthJSON.tkRequestData, vm.oAuthJSON.token));
                    //     }
                    // }, vm.cfg.apiMSecs);

                    //  reset symbol string and filter all the stocks with no volume for api calls
                    vm.symbolsStr = '';
                    $.each(data.response.quotes.quote, function(k, v) {
                        
                        if(v.vl > vm.cfg.stockMinVolume){
                            vm.symbolsStr += v.symbol + ',';
                        }
                                
                    });
                    vm.cfg.callOnce = false;
                }
               // For speed test ONLY
                vm.cfg.loopCounter++;

                if(vm.cfg.loopCounter === (vm.cfg.loopCycles +1)){
                    vm.cfg.loopCounter = 1;
                    vm.cfg.loopArr1 = [];
                }
                if(vm.cfg.run){
                    setTimeout(function(){
                    vm.getStockData(vm.oAuthJSON.tkRequestData.url, vm.oAuthJSON.tkRequestData.method, vm.oAuthJSON.consumer.authorize(vm.oAuthJSON.tkRequestData, vm.oAuthJSON.token));

                    //run tk stock data thru tests and push to view
                   
                    vm.stocksPassed = vm.scanStocks(data.response.quotes.quote, vm.stocksPassed, vm.symbolsJSON, vm.cfg);
                    vm.viewStocks();

                    },vm.cfg.apiMSecs);

                }

            });
        }

        function viewStocks() {

            // pass final arrays to view
            vm.stocksA = vm.stocksPassed.stocksPassA;
            vm.stocksB = vm.stocksPassed.stocksPassB;
            // console.log(vm.stocksPassed.stocksPassB);
            //for speed test
            if(vm.cfg.loopCounter == vm.cfg.loopCycles){
                vm.stocksC = [];
            }

            vm.stocksC = vm.stocksC.concat(vm.stocksPassed.stocksPassC);
            vm.stocksD = vm.stocksPassed.stocksPassD;
            vm.stocksE = vm.stocksPassed.stocksPassE;
            vm.stocksG = vm.stocksPassed.stocksPassG;
            
            $scope.$apply();
            vm.stocksPassed = {
                stocksPassA: [],
                stocksPassB: [],
                stocksPassC: [],
                stocksPassD: [],
                stocksPassE: [],
                stocksPassG: [],
                stocksAlert: []
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