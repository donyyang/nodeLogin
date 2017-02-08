var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

mongoose.connect(config.mongodb);
mongoose.set('debug',true);

var registerSchema = new Schema({
	userName: String,
	pwd: String,
});

var registerSchema = mongoose.model('registerSchema', registerSchema);

exports.registerSchema = registerSchema;