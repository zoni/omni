'use strict';

/**
 *
 */
var index = function(req, res){
	var locals = {
		// items: [
		// 	{
		// 		key: 'admin',
		// 		name: 'Administrator'
		// 	}
		// ]
	};
	res.render(__dirname + '/views/index', locals);
};

module.exports = {
	index: index
};

