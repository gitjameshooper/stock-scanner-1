'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:StocksCtrl
 * @description
 * # StocksCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('StocksCtrl', function ($scope, stock) {
  	window.console.log(stock);
     $scope.yo = stock.getList().$object;
  });
