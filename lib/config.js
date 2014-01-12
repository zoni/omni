'use strict';

var fs = require('fs'),
	cache = {};

module.exports = function(path){
	if (cache[path]){
		return cache[path];
	}

	if (!fs.existsSync(path)){
		console.log('Cannot find config file ' + path + ', exiting...');
		process.exit();
	}

	var json = fs.readFileSync(path).toString('utf8');
	try {
		cache[path] = JSON.parse(json);
		return cache[path];
	} catch(e) {
		return;
	}
};

