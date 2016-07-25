var mongoose = require('mongoose');

// Create Stock Schema

var stockSchema = new mongoose.Schema({
	  symbol:{
	  	type: String,
	  	required: true
	  },
	  price: {
	  	type: Number,
	  	required: true
	  }
});

// Export the model Schema
module.exports = stockSchema;