'use strict';

var isArray = require('mout/lang/isArray'),
	isObject = require('mout/lang/isObject'),
	types = require('./types');

/**
 *
 */
var Fields = function(fields, data){
	if (!(this instanceof Fields)){
		return new Fields(fields);
	}

	if (!isArray(fields) || !fields.length){
		throw new Error('Fields must be an array and contain at least one field');
	}

	this.fields = [];

	var i, len = fields.length, spec, type;
	for (i = 0; i < len; i++){
		spec = fields[i];
		type = types[spec.type];
		if (!type){
			throw new Error('field type does not exist');
		}
		if (!type.isValidSpec(spec)){
			throw new Error('Field specification is invalid');
		}
		this.fields.push(spec);
	}

	if (data){
		this.setData(data);
	}
};

/**
 *
 */
Fields.prototype.setData = function(data){
	this.data = data;
};

/**
 *
 */
Fields.prototype.toInputArray = function(){
	var fields = [], i, len = this.fields.length,
		spec, type, dataIsObject = isObject(this.data), value;
	for (i = 0; i < len; i++){
		spec = this.fields[i];
		type = types[spec.type];
		value = dataIsObject ? this.data[spec.name] : null;
		fields.push(type.toInput(spec, value));
	}
	return fields;
};

module.exports = Fields;

