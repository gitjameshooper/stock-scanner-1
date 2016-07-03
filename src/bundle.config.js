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
        './src/index.js',
      ]
    }
  }
};