'use strict';
// var allApi = require('./allApi');

module.exports = function (app) {
	var files = [
		'api-login.js',
	]

	files.forEach(function (item,index) {
		if(item.match(/.+\.js/) && item !== 'index.js' && item.match(/.+\.js/) && item !== 'allApi.js') {
			require('./'+item)(app);
		}
	});
	
	app.get(['/','/index'],function (req, res) {
		res.render('index.html');
	});
	app.get(['/login','/login.html'],function (req, res) {
		res.render('login.html');
	});
}