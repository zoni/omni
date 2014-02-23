require('./app');
require('./config');

var isArray = require('mout/lang/isArray'),
	modules = require('./modules'),
	config = require('../lib/parseJSONFile')(__dirname + '/../config.json');

modules.load(__dirname + '/modules');

if (config.modulePaths && isArray(config.modulePaths)){
	for (var i = 0, len = config.modulePaths.length; i < len; i++){
		modules.load(__dirname + '/../' + config.modulePaths[i]);
	}
}
