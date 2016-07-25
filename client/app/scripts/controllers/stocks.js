'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:StocksCtrl
 * @description
 * # StocksCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('StocksCtrl', function($scope, $http) {
         
        $http({
            method: 'GET',
            url: 'http://localhost:3000/stock/ABC'
        }).then(function successCallback(response) {
             window.console.log(response.data);
             $scope.yo = response.data;
              
        }, function errorCallback(response) {
             window.console.log(response);
        });

    });