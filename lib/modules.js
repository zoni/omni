'use strict';

var fs = require('fs'),
	path = require('path'),
	isString = require('mout/lang/isString'),
	isFunction = require('mout/lang/isFunction'),
	forOwn = require('mout/object/forOwn');

var requiredFiles = ['routes.json', 'controller.js'];

/**
 * Load modules from given directory
 *
 * It will apply each module's routes based on the specification found in
 * routes.json. It will also check if the methods that are referred to exist
 *
 * @param {Object} app An object that listens to http verb methods
 * @param {String} dir
 */
var load = function(app, modulesPath){
	modulesPath = path.normalize(modulesPath);
	if (!fs.existsSync(modulesPath)){
		throw new Error('Cannot load modules from path', modulesPath);
	}

	var modules = fs.readdirSync(modulesPath);
	if (!modules || !modules.length) return;

	var modulePath, f, data, controller, fullRoute;
	modules.forEach(function(moduleName){
		modulePath = modulesPath + '/' + moduleName;
		if (/^[_.]/.test(moduleName) ||
			!fs.statSync(modulePath).isDirectory()) return;

		for (f = 0; f < requiredFiles.length; f++){
			if (!fs.existsSync(modulePath + '/' + requiredFiles[f])){
				console.log('Required file ' + requiredFiles[f] + ' missing for module ' + moduleName);
				return;
			}
		}

		data = fs.readFileSync(modulePath + '/routes.json');
		try {
			data = JSON.parse(data);
		} catch(e){
			console.log('Failed to parse routes for module ' + moduleName + ': ' + e.message);
			return;
		}

		controller = require(modulePath + '/controller');

		forOwn(data, function(verbs, route){
			route = route == '/' && moduleName != 'root' ? '' : route;
			if (isString(verbs)){
				verbs = {get: verbs};
			}

			forOwn(verbs, function(fnName, verb){
				if (!controller[fnName] || !isFunction(controller[fnName])){
					console.log('Function `' + fnName + '` not found or invalid in `' + moduleName + '` controller');
					return;
				}
				if (!/^(?:get|post|put|delete|head|patch|options)$/.test(verb)){
					console.log('Invalid HTTP verb `' + verb + '` for route `' + route + '`');
					return;
				}

				fullRoute = (moduleName != 'root' ? '/' + moduleName : '') + route;
				app[verb](fullRoute, controller[fnName]);
			});
		});
	});
};

module.exports = {
	load: load
};

