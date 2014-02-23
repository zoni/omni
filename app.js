'use strict';

if (process.cwd() != __dirname){
	process.chdir(__dirname);
}

require('./core/bootstrap');

var argv = require('optimist').argv,
	port = parseInt(argv.p, 10) || 5000,
	app = require('./core/app');

if (app.settings.env == 'development'){
	var swig = require('swig');
	swig.setDefaults({cache: false});
}

app.listen(port, function(){
	console.log('Listening on port %s', port);
});
