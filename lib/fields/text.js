'use strict';

var mixIn = require('mout/object/mixIn'),
	base = require('./base');

module.exports = mixIn({}, base, {
	/**
	 * Return a html string representing the label
	 * @param {Object} spec
	 * @param {String} value
	 */
	inputToHTML: function(spec, value){
		value = value || spec.value;

		var html = '<input type="' + spec.type + '"';

		if (spec.name){
			html += ' name="' + spec.name + '"';
		}

		if (value){
			html += ' value="' + value + '"';
		}

		if (spec.required){
			html += ' required';
		}

		html += '>';
		return html;
	}
});

