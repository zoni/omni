'use strict';

var model = require('./model'),
	Fields = require('./../../lib/fields'),
	manifest = require('./../../lib/parseJSONFile')(__dirname + '/manifest.json');

var views = {
	list: __dirname + '/views/list',
	form: __dirname + '/views/form',
	detail: __dirname + '/views/detail'
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var list = function(req, res){
	model.find(function(err, items){
		res.render(views.list, {
			items: items
		});
	});
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var form = function(req, res){
	var fields = new Fields(manifest.fields);
	if (req.params.id){
		model.read({_id: req.params.id}, function(err, item){
			if (err || !item){
				res.redirect('/users/add/');
			}
			fields.setData(item);
			res.render(views.form, {
				action: '/users/edit/' + req.params.id + '/',
				fields: fields.toInputArray()
			});
		});
		return;
	}

	res.render(views.form, {
		action: '/users/add/',
		fields: fields.toInputArray()
	});
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var detail = function(req, res){
	model.read({_id: req.params.id}, function(err, item){
		res.render(views.detail, {
			item: item
		});
	});
};

module.exports = {
	list: list,
	form: form,
	detail: detail
};

