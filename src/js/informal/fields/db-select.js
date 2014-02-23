'use strict';

var FieldBase = require('informal').bases.Field,
	agent = require('agent'),
	bind = require('mout/function/bind'),
	zen = require('elements/zen'),
	XHRForm = require('../../xhrform'),
	behaviors = require('../../behavior');

/**
 * Create a new db select field
 * @param {object} spec
 * @param {mixed} value
 */
var FieldDbSelect = function(spec, value){
	if (!(this instanceof FieldDbSelect)){
		return new FieldDbSelect(spec, value);
	}
	FieldBase.call(this, spec, value);
};

FieldDbSelect.prototype = Object.create(FieldBase.prototype);
FieldDbSelect.prototype.constructor = FieldDbSelect;

/**
 * Build up all elements of the field
 */
FieldDbSelect.prototype.build = function(){
	if (this.wrap) return;

	this.wrap = zen('li.field-db-select');
	zen('label').text(this.spec.label || '').insert(this.wrap);
	this.input = zen('select').insert(this.wrap);

	zen('option').value('').text('...').insert(this.input);

	if (this.spec.options){
		var i, len = this.spec.options.length, option;
		for (i = 0; i < len; i++){
			option = this.spec.options[i];
			zen('option').value(option.value).text(option.label).insert(this.input);
		}
	}

	if (this.spec.addUrl){
		this.addLink = zen('a').href('#').text('Add new...').insert(this.wrap);
		this.addLink.on('click', bind(function(e){
			e.preventDefault();
			this.openDialog();
		}, this));
	}
};

/**
 *
 */
FieldDbSelect.prototype.openDialog = function(){
	var lbWrap = zen('div.lightbox-wrap'),
		lbContent = zen('div.lightbox-content').insert(lbWrap);

	lbWrap.insert(document.body);

	agent.get(this.spec.addUrl, bind(function(response){
		lbContent.html(response.body);
		behaviors.execute();
		new XHRForm(lbContent.search('[data-informal] form')[0], {
			onSuccess: bind(function(data){
				zen('option').text(data[this.spec.labelKey || 'name']).value(data._id).insert(this.input);
				this.input.value(data._id);
				lbWrap[0].style.display = 'none';
			}, this)
		});
	}, this));
};

module.exports = FieldDbSelect;
