var restful = require('node-restful');

module.exports = function(app, route) {
	// Setup the controller for restful
	var rest = restful.model('stock', app.models.stock).methods(['get','put','post','delete']);

	// register this endpoint with the app
	rest.register(app, route);

	// return middleware
	return function(req, res, next){
		next();
	};
}