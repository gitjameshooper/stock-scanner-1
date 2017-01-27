(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .factory('tierFactory', tierFactory);
    tierFactory.$inject = ['$log'];

    function tierFactory($log) {
        var cfg = { 
            symbolsCurTier: 0,
            symbolsCurCount: 0
        }
        return {
            createTiers: createTiers,
            formatTierSymbols: formatTierSymbols
        };

        function createTiers(symbolsJSON, symbolsPerTier) {

            var symbolCount = Object.keys(symbolsJSON).length / symbolsPerTier,
                symbolCountR = Object.keys(symbolsJSON).length % symbolsPerTier,
                tierStart = 0,
                tierEnd = symbolsPerTier,
                symbolsTierArr = [];

            for (var i = 1; i < symbolCount; i++) {
                symbolsTierArr.push([tierStart, tierEnd]);
                tierStart = tierEnd + 1;
                tierEnd += symbolsPerTier;
            }

            if (symbolCountR !== 0) {
                symbolsTierArr.push([tierStart, symbolCountR + tierStart - 1]);
            }
            return symbolsTierArr;
        }

        function formatTierSymbols(symbolsJSON, stocksPassedStr, symbolTiers, oAuthJSON, mainCfg) {
            
                var symbolStr = '',
                    symbolsBegCount = 0;
                    if(stocksPassedStr){
                        symbolStr = stocksPassedStr;
                    }
                    
                // cycle thru symbols in a tier
                $.each(symbolsJSON, function(k, v) {
                       
                    if ((symbolsBegCount >= symbolTiers[cfg.symbolsCurTier][0]) && (symbolTiers[cfg.symbolsCurTier][0] <= cfg.symbolsCurCount) && (cfg.symbolsCurCount <= symbolTiers[cfg.symbolsCurTier][1])) {
                        symbolStr += v.symbol + ',';
                        // old way symbolStr += k + ',';
                        cfg.symbolsCurCount++;
                    }
                    symbolsBegCount++;
                    
                });

                cfg.symbolsCurTier++;
               
                // window.console.log('loop- '+mainCfg.loopCounter);
                if (cfg.symbolsCurTier >= symbolTiers.length) {
                    cfg.symbolsCurTier = 0;
                    cfg.symbolsCurCount = 0;
                    mainCfg.loopCounter++;
                    if(mainCfg.loopCounter === 4){
                        // window.console.log('new-loop');
                        mainCfg.loopCounter = 0;
                    }
                }
                symbolStr = symbolStr.slice(0, -1);
            
                // return url with symbols
                return oAuthJSON.tkRequestData.url + symbolStr;
              
        }
    }
})();