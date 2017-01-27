module.exports = {
    bundle: {
        main: {
            scripts: [
                './node_modules/jquery/dist/jquery.js',
                './node_modules/crypto-js/crypto-js.js',
                './node_modules/oauth-1.0a/oauth-1.0a.js',
                './node_modules/angular/angular.min.js',
                './node_modules/angular-route/angular-route.min.js',
                './node_modules/underscore/underscore-min.js',
                './client/js/app.js',
                './client/js/services/symbolsService.js',
                './client/js/services/oAuthService.js',
                './client/js/factories/scanFactory.js',
                './client/js/factories/xtraFactory.js',
                './client/js/factories/tierFactory.js',
                './client/js/tests/testOFactory.js',
                './client/js/tests/testAFactory.js',
                './client/js/tests/testBFactory.js',
                './client/js/tests/testCFactory.js',
                './client/js/tests/testDFactory.js',
                './client/js/controllers/stockController.js',
                './client/js/controllers/mongoController.js'
            ]
        }
    }
};