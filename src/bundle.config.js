module.exports = {
  bundle: {
    main: {
      scripts: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/crypto-js/crypto-js.js',
        './node_modules/oauth-1.0a/oauth-1.0a.js',
        './src/simulator.js',
        './src/index.js',
      ]
    }
  }
};