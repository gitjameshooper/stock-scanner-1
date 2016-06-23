        /*  ALL C TESTS */
    $s.moveTestC = function(stock) {
        var stockLo = Number(stock.lo),
            stockHi = Number(stock.hi),
            stockDiff = (stockHi - stockLo).toFixed(2),
            stockDiffPctA = (stockDiff / stockLo).toFixed(3) * 100;

        if (stockDiffPctA >= $s.cfg.stockDiffPctA) {
            return true;
        }
    }
    $s.priceMiddleTestC = function(stock) {
        var stockLo = Number(stock.lo),
            stockHi = Number(stock.hi),
            stockPrice = Number(stock.last),
            stockMid = (stockHi + stockLo)/2;
            

        if (stockPrice >=  stockMid - .10  && stockPrice  <=  stockMid + .10) {
            return true;
        }
    }


    test stock below vwap
    $s.vwapTestC = function(stock) {
            var stockVwap = Number(stock.vwap),
                stockPrice = Number(stock.last);

            if (stockPrice <= stockVwap) {
                return true;
            }
        }
        // test stock above yesterday's close
    $s.closeTestC = function(stock) {
            var stockClose = Number(stock.cl),
                stockPrice = Number(stock.last);

            if (stockPrice >= stockClose) {
                return true;
            }
        }
    /*  ALL D TESTS */
        // test volatility of stock compared to market
    $s.betaTestD = function(stock) {
            var stockBeta = Number(stock.beta);

            if (stockBeta >= $s.cfg.stockBeta) {
                return true;
            }
        }
        // test if stock is away from vwap
    $s.vwapTestD = function(stock) {
        var stockVwap = Number(stock.vwap),
            stockPrice = Number(stock.last),
            stockDiffVwap = (stockVwap - stockPrice).toFixed(2),
            stockDiffPctVwapD = (stockDiffVwap / stockPrice).toFixed(3) * 100;

        if (stockDiffPctVwapD >= $s.cfg.stockAwayPctB) {
            return true;
        }
    }

       $s.evenTest = function(stock) {
        var stockPrice = Number(stock.last),
            stockPriceR = Math.round(stockPrice);

        if (stockPrice <= (stockPriceR + .10) && stockPrice >= (stockPriceR - .10)) {
            return true;
        }
    }