'use strict';

var informal = require('informal'),
	behaviors = require('./behavior');

informal.registerField('db-select', require('./informal/fields/db-select'));
informal.registerField('location', require('./informal/fields/location'));

behaviors.register('data-informal', function(el){
	var spec = el.querySelector('[data-informal-spec]');
	if (!spec) return;

	try {
		spec = JSON.parse(spec.innerHTML);
	} catch(e){
		console.log(e);
	}

	var form = new informal.Form(spec);
	form.attach(el);
});

behaviors.execute();
