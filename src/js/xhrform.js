'use strict';

var $ = require('elements/events'),
	agent = require('agent'),
	bind = require('mout/function/bind');
require('elements/traversal');

/**
 *
 */
var XHRForm = function(el, options){
	this.form = $(el);

	this.form.on('submit', bind(function(e){
		e.preventDefault();
		var inputs = this.form.search('input[name], select[name], textarea[name]'),
			data = {}, i, len = inputs.length, input;

		for (i = 0; i < len; i++){
			input = $(inputs[i]);
			data[input.attribute('name')] = input.value();
		}

		agent.post(this.form.attribute('action'), data, function(response){
			options.onSuccess(response.body);
		});
	}, this));
};

module.exports = XHRForm;
