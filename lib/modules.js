'use strict';

var fs = require('fs'),
	path = require('path'),
	isString = require('mout/lang/isString'),
	isFunction = require('mout/lang/isFunction'),
	forOwn = require('mout/object/forOwn');

var requiredFiles = ['manifest.json', 'controller.js'];

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

	var modulePath, f, manifest, controller, fullRoute;
	modules.forEach(function(moduleName){
		modulePath = modulesPath + '/' + moduleName;
		if (/^[_.]/.test(moduleName) ||
			!fs.statSync(modulePath).isDirectory()) return;

		for (f = 0; f < requiredFiles.length; f++){
			if (!fs.existsSync(modulePath + '/' + requiredFiles[f])){
				console.log('Required file `%s` missing for module `%s`', requiredFiles[f], moduleName);
				return;
			}
		}

		try {
			manifest = JSON.parse(fs.readFileSync(modulePath + '/manifest.json'));
		} catch(e){
			return console.log('Failed to parse routes for module `%s`: %s', moduleName, e.message);
		}

		controller = require(modulePath + '/controller');

		forOwn(manifest.routes, function(verbs, route){
			fullRoute = (manifest.slug !== '' ? '/' + manifest.slug : '') + route;

			if (isString(verbs)){
				verbs = {get: verbs};
			}

			forOwn(verbs, function(fnName, verb){
				if (!controller[fnName] || !isFunction(controller[fnName])){
					return console.log('Function `%s` not found or invalid in `%s` controller', fnName, moduleName);
				}
				if (!/^(?:get|post|put|delete|head|patch|options)$/.test(verb)){
					return console.log('Invalid HTTP verb `' + verb + '` for route `' + route + '`');
				}
				app[verb](fullRoute, controller[fnName]);
			});
		});
	});
};

module.exports = {
	load: load
};

