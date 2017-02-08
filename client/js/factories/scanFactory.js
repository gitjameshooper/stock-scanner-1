(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('scanFactory', scanFactory);
    scanFactory.$inject = ['$log', 'testOFactory', 'testAFactory', 'testBFactory', 'testCFactory', 'testDFactory','testEFactory'];

    function scanFactory($log, testOFactory, testAFactory, testBFactory, testCFactory, testDFactory, testEFactory) {
        var delistArr = JSON.parse(localStorage.getItem("delist")) || [];

        return {
            scanStocks: scanStocks,
            formatStock: formatStock,
            delistStock: delistStock,
            emptyDelist: emptyDelist
        };

        function scanStocks(quotesData, stocksPassed, symbolsJSON, cfg) {

            $.each(quotesData, function(key, stock) {
                 
                // merge stock float data from JSON
                if(cfg.showTest.testD){
                    $.each(symbolsJSON, function(k, v) {
                        if(stock.symbol == v.symbol){
                            stock.float = v.float;
                            stock.shortRatio = v.shortRatio;
                        }
                    });
                }else{
                    stock.float = 0;
                    stock.shortRatio = 0;
                }

                // format stock values
                formatStock(stock, cfg.accountVal);
                    
                // run all stocks thru the delist, volume, price test
                if (testOFactory.delistTest(stock, JSON.parse(localStorage.getItem("delist"))) && testOFactory.volTest(stock, cfg.stockVolumeObj) && testOFactory.priceTest(stock, cfg.stockMinPrice, cfg.stockMaxPrice)) {
    
                    // check if the stock passes all the A Tests
                    if (cfg.showTest.testA && testOFactory.excludeETF(stock, cfg.etfArr) && testAFactory.allTests(stock, stocksPassed.stocksAlert, cfg)) {
                        stocksPassed.stocksPassA.push(stock);
                    }

                    // check if the stock passes all the B Tests
                    if (cfg.showTest.testB && testOFactory.excludeETF(stock, cfg.etfArr) && testBFactory.allTests(stock, stocksPassed.stocksAlert, cfg)) {
                        stocksPassed.stocksPassB.push(stock);
                    }
                    // check if the stock passes all the C Tests
                    if (cfg.showTest.testC && testOFactory.excludeETF(stock, cfg.etfArr) && testCFactory.allTests(stock, stocksPassed.stocksAlert, cfg)) {
                        stocksPassed.stocksPassC.push(stock);
                    }
                    // check if the stock passes all the D Tests
                    if (cfg.showTest.testD && testOFactory.excludeETF(stock, cfg.etfArr) && testDFactory.allTests(stock, stocksPassed.stocksAlert, cfg)) {
                        stocksPassed.stocksPassD.push(stock);
                    }
                    // check if the stock passes all the E Tests
                    if (cfg.showTest.testE && testOFactory.excludeETF(stock, cfg.etfArr) && testEFactory.allTests(stock, stocksPassed.stocksAlert, cfg)) {
                        stocksPassed.stocksPassE.push(stock);
                    }
                }
            });
            return stocksPassed;
        }

        function formatStock(stock, accountVal) {
            stock.bid = Math.round(Number(stock.bid) * 100) / 100;
            stock.vwap = Math.round(stock.vwap * 100) / 100;
            stock.ask = Math.round(stock.ask * 100) / 100;
            stock.prbook = Math.round(stock.prbook * 100) / 100;
            stock.lo = Math.round(stock.lo * 100) / 100;
            stock.hi = Math.round(stock.hi * 100) / 100;
            stock.last = Math.round(stock.last * 100) / 100;
            stock.mid = Math.round(((stock.hi + stock.lo) /2)* 100) / 100;
            stock.oldhidifflo = (stock.hi - stock.lo) / stock.last;
            stock.hidifflo = Math.round((stock.hi - stock.lo)*100)/100;
            stock.closeMid = Math.round(Math.abs(stock.mid - stock.last)* 100) / 100;
            stock.vl = Number(stock.vl);
            stock.pvol = Number(stock.pvol);
            stock.volRotated =  Math.round((stock.vl / stock.pvol) * 100) / 100;
            stock.sho = Number(stock.sho);
            stock.chg = Number(stock.chg);
            stock.pchg = Number(stock.pchg);
            stock.opn = Math.round(stock.opn * 100) / 100;
            stock.float = Math.round(stock.float * 100) / 100;
            stock.floatRotated = Math.round((stock.vl / stock.float) * 100) / 100;
            stock.shortRatio = Number(stock.shortRatio);
            stock.plo = Math.round(stock.plo * 100) / 100;
            stock.phi = Math.round(stock.phi * 100) / 100;
            stock.popn = Math.round(stock.popn * 100) / 100;
            stock.pcls = Math.round(stock.pcls * 100) / 100;
            stock.prchg = Number(stock.prchg);
            stock.shares = Math.round((accountVal / stock.last).toFixed(0) / 2);
            stock.shares = Math.ceil(stock.shares/100)*100;
            stock.spread = Number((stock.ask - stock.bid).toFixed(2));
                   
        }
          
        // remove stock from view - add to the delist array
        function delistStock(stock, stocksArr) {
            stocksArr.splice(stocksArr.indexOf(stock), 1);
            delistArr.push(stock.symbol);
            localStorage.setItem("delist", JSON.stringify(delistArr));
        }
        function emptyDelist(){
            delistArr = [];
            localStorage.removeItem('delist');
        }

    }
})();