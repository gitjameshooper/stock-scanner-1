'use strict';

describe('Controller: StocksCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var StocksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StocksCtrl = $controller('StocksCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StocksCtrl.awesomeThings.length).toBe(3);
  });
});
