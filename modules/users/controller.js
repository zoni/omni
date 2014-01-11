'use strict';

/**
 *
 */
var index = function(req, res){
	res.render(__dirname + '/views/index');
};

/**
 *
 */
var create = function(req, res){
	res.render(__dirname + '/views/create');
};

module.exports = {
	index: index,
	create: create
};

