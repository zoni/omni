'use strict';

module.exports = {
	/**
	 * Check if the given specification is valid
	 * @param {Object} spec
	 */
	isValidSpec: function(spec){
		return true;
	},

	/**
	 * Return a html string representing the label
	 * @param {Object} spec
	 */
	labelToHTML: function(spec){
		var html = '';
		if (spec.label){
			html += '<label>' + spec.label + '</label>';
		}
		return html;
	},

	/**
	 * Return html markup for label and input
	 * @param {Object} spec
	 * @param {String} value
	 */
	toInput: function(spec, value){
		return {
			label: this.labelToHTML(spec),
			input: this.inputToHTML(spec, value)
		};
	}
};

