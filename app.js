'use strict';

if (process.cwd() != __dirname){
	process.chdir(__dirname);
}

var express = require('express'),
	swig = require('swig'),
	cons = require('consolidate'),
	argv = require('optimist').argv;

var app = express()
	.engine('html', cons.swig)
	.set('view engine', 'html')
	.set('views', __dirname + '/views')
	.use(express.bodyParser())
	.use(express.cookieParser())
	.use(express.session({
		secret: 'my_secret_string',
		key: 'omni'
	}));

if (app.settings.env == 'development'){
	swig.setDefaults({cache: false});
}

require('./lib/modules').load(app, __dirname + '/modules');

var port = parseInt(argv.p, 10) || 5000;
app.listen(port, function(){
	console.log('Listening on port %s', port);
});

