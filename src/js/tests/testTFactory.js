// Test Notes:  Used to find stocks red to green 
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testCFactory', testCFactory);
    testCFactory.$inject = ['$log', 'testOFactory'];

    function testCFactory($log, testOFactory) {
        var etfArr = ["SJNK","OIH","SQQQ","XOP","ERY","USLV","FAZ","UVXY","VIXY","PDBC","CATH","VXX","UWTI","DWTI","DGAZ","DUST","XIV","TZA","DBEF","DBJP","UGAZ","SPXS","XIV","XOP","GDX","SVXY"];
        return {
            allTests: allTests

        };
        // check if the stock passes all the C Tests
        function allTests(stock, stocksAlert) {
            if (lodTestC(stock) && priorLodTestC(stock) && vwapTestC(stock) && priorDayMidTestC(stock) && priorHODTestC(stock) && excludeTestC(stock)) {
                return true;
            }
        }

        function excludeTestC(stock) {
            if (_.indexOf(etfArr, stock.symbol) < 0) {

                return true;
            }
        }
        // if curent day lo lower than prior lo
        function priorLodTestC(stock) {
            if (stock.plo > stock.lo) {
                return true;
            }
        }
        // if current price above prior low
        function lodTestC(stock) {
            if (stock.plo < stock.last) {
                return true;
            }
        }
        // if lower than prior day midpoint
        function priorDayMidTestC(stock) {
            var midPoint = (stock.phi + stock.plo) / 2;
            if (stock.last < midPoint) {
                return true;
            }
        }
        // stock above vwap
        function vwapTestC(stock) {
            if (stock.last > stock.vwap) {
                return true;
            }
        }
        // check potential range
        function priorHODTestC(stock) {
            var priorDiff = stock.phi - stock.lo,
                priorPct = priorDiff / stock.lo;
            stock.stockDiffPriorPctCtoH = Number((priorPct).toFixed(2));

            return true;
        }


    }
})();