(function() {
    'use strict';
 
    angular
        .module('stockScannerApp', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/', {
                templateUrl: "/views/home.html"
            })
            .when('/how-it-works', {
                templateUrl: "/views/how-it-works.html"
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
