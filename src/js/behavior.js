'use strict';

var indexOf = require('mout/array/indexOf'),
	isArray = require('mout/lang/isArray'),
	behaviors = [],
	cache = {};

/**
 * Register a new behavior
 * @param {String} attribute
 * @param {Function} Fn
 */
var register = function(attribute, Fn){
	behaviors.push({
		attribute: attribute,
		Fn: Fn
	});
};

/**
 * Execute all cached behaviors
 */
var execute = function(){
	var i, len = behaviors.length, b, els, x, options, y;

	for (i = 0; i < len; i++){
		b = behaviors[i];
		if (!cache[b.attribute]){
			cache[b.attribute] = [];
		}

		els = document.querySelectorAll('[' + b.attribute + ']');
		if (els && els.length){
			for (x = 0; x < els.length; x++){
				if (indexOf(cache[b.attribute], els[x]) != -1) continue;
				cache[b.attribute].push(els[x]);

				options = {};
				try {
					options = JSON.parse(els[x].getAttribute(b.attribute));
				} catch(e){}

				if (!isArray(options)){
					options = [options];
				}
				for (y = 0; y < options.length; y++){
					new b.Fn(els[x], options[y]);
				}
			}
		}
	}
};

module.exports = {
	register: register,
	execute: execute
};
