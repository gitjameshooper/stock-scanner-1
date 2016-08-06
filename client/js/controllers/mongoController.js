(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .controller('mongoController', mongoController);
    mongoController.$inject = ['$scope', '$log', '$http'];

    function mongoController($scope, $log, $http) {
    	var vm = this;
         $http({
					  method: 'GET',
					  url: '/stock/ABC'
					}).then(function successCallback(response) {
							window.console.log(response);
							vm.stock = response.data[0];
					    // this callback will be called asynchronously
					    // when the response is available
					    },
					    function errorCallback(response) {
					    	alert(response);
					        // called asynchronously if an error occurs
					        // or server returns response with an error status.
					});
		}
				 
})();