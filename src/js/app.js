// api limits 1 call per second
// https://developers.tradeking.com/documentation/market-ext-quotes-get-post
//  use this to pull stocks from finviz var arr = []; $('.screener-link-primary').each(function(){  var it = $(this).text(); arr.push(it); }); window.console.log(arr);
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_price_o1,ta_volatility_mo2&ft=4&o=-price
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o750,sh_curvol_o750,sh_price_o1&ft=4&o=-price&r=121
// http://finviz.com/screener.ashx?v=111&f=sh_avgvol_o200,sh_price_o1&ft=4&o=-price&r=181
// for volume cacluation based off time
// https://github.com/cdituri/node-tradeking  example for websocket
// https://investor.tradeking.com/Modules/Trading/defaultTrade.php
//https://openshift.redhat.com/app/console/applications
(function() {
    'use strict';
 
    angular
        .module('stockScannerApp', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/', {
                templateUrl: "/views/home.html",
                controller: 'stockController'
            })
            .when('/dog', {
                templateUrl: "/views/dog.html",
                controller: 'stockController'
            })
            .otherwise({
                redirectTo: "/"
            });
        }]);

})();