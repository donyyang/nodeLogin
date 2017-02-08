var express = require('express');
var engines = require('consolidate');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var config = require('./config');

var app = global.app = express();

app.set('views', path.join(__dirname + config.viewPath));
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app
  //cookie
  .use(cookieParser())
  .use(bodyParser.urlencoded({
    extended: false
  }))
  .use(bodyParser.json())

require('./routes')(app);

app.listen(config.port,function () {
	console.log('app is listening');
});

module.exports = app;