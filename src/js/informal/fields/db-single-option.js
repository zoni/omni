'use strict';

var FieldSingleOption = require('informal').fields.SingleOption,
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
var FieldDbSingleOption = function(spec, value){
	if (!(this instanceof FieldDbSingleOption)){
		return new FieldDbSingleOption(spec, value);
	}
	FieldSingleOption.call(this, spec, value);
};

FieldDbSingleOption.prototype = Object.create(FieldSingleOption.prototype);
FieldDbSingleOption.prototype.constructor = FieldDbSingleOption;

/**
 * Build up all elements of the field
 */
FieldDbSingleOption.prototype.build = function(){
	if (this.wrap) return;
	FieldSingleOption.prototype.build.call(this);
	this.wrap.addClass('field-db-single-option');

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
FieldDbSingleOption.prototype.openDialog = function(){
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

module.exports = FieldDbSingleOption;
