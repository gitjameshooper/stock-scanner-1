'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngRoute',
    'restangular',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('http://localhost:3000');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/stocks', {
        templateUrl: 'views/stocks.html',
        controller: 'StocksCtrl',
        controllerAs: 'stocks'
      })
      .otherwise({
        redirectTo: '/'
      });
      
  })
  .factory('StockRestangular', function(Restangular){
    return Restangular.withConfig(function(RestangularCongfigurer){
      RestangularCongfigurer.setRestangularFields({
        id: '_id'
      });
    });
  })
  .factory('Stock', function(StockRestangular){
    return StockRestangular.service('stocks');

  });
