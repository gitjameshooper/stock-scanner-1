// Test Notes:  Used to find stocks red to green 
(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('testCFactory', testCFactory);
    testCFactory.$inject = ['$log', 'testOFactory'];

    function testCFactory($log, testOFactory) {
        var etfArr = ["SJNK", "OIH", "SQQQ", "XOP", "ERY", "USLV", "FAZ", "UVXY", "VIXY", "PDBC", "CATH", "VXX", "UWTI", "DWTI", "DGAZ", "DUST", "XIV", "TZA", "DBEF", "DBJP", "UGAZ", "SPXS", "XIV", "XOP", "GDX", "SVXY"];
        return {
            allTests: allTests

        };
        // check if the stock passes all the C Tests
        function allTests(stock, stocksAlert, stockPriorDayPctC) {
            if (vwapTestC(stock) && pclsTestC(stock) && priorDayTestC(stock, stockPriorDayPctC) && pctDiffTestC(stock) && excludeTestC(stock)) {
                return true;
            }
        }

        function excludeTestC(stock) {
            if (_.indexOf(etfArr, stock.symbol) < 0) {

                return true;
            }
        }
        // if curent day lo lower than prior lo
        function priorDayTestC(stock, stockPriorDayPctC) {
            var pctPriorDay = stock.prchg / stock.pcls;
            stock.pctPriorDay = Number(pctPriorDay.toFixed(2));

            if (stock.pctPriorDay > (stockPriorDayPctC / 100)) {
                return true;
            }
        }

        function vwapTestC(stock) {
            if (stock.vwap > stock.last) {
                return true;
            }
        }

        function pclsTestC(stock) {
            if (stock.pcls > stock.last) {
                return true;
            }
        }

        function pctDiffTestC(stock) {
            var pctDiff = stock.pcls - stock.last,
                pctDiffC =  -(pctDiff / stock.last) * 100;
                stock.pctDiffC = Number(pctDiffC.toFixed(2));

             return true;   
        }
    }
})();