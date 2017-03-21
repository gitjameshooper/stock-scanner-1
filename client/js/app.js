(function() {
    'use strict';

    angular
        .module('stockScannerApp', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: "/views/home.html"
                })
                .when('/how-it-works', {
                    templateUrl: "/views/how-it-works.html"
                })
                .when('/playbook', {
                    templateUrl: "/views/playbook.html"
                })
                .when('/scanner', {
                    templateUrl: "/views/scanner.html",
                    controller: 'stockController',
                    controllerAs: 'stockApp'
                })
                .when('/mongo', {
                    templateUrl: "/views/mongo.html",
                    controller: 'mongoController',
                    controllerAs: 'stockApp'
                })
                .otherwise({
                    redirectTo: "/scanner"
                });
        }]);

})();
