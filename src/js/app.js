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
                controller: 'stockController',
                controllerAs: 'stockApp'
            })
            .when('/how-it-works', {
                templateUrl: "/views/how-it-works.html",
                controller: 'stockController',
                controllerAs: 'stockApp'
            })
            .when('/scanner', {
                templateUrl: "/views/scanner.html",
                controller: 'stockController',
                controllerAs: 'stockApp'
            })
            .otherwise({
                redirectTo: "/"
            });
        }]);

})();

// var jsonSymbols = [];
// localStorage.setItem("jsonSymbols", jsonSymbols);

// var jsonSymbols = localStorage.getItem("jsonSymbols");
// $('.screener-link-primary').each(function(){  var it = $(this).text(); jsonSymbols.push(it); });
// var url = $('#screener-content .body-table .tab-link').eq( 2 ).attr('href');  window.location = url;