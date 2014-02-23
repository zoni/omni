'use strict';

var merge = require('mout/object/merge'),
	manifest = require('../../../lib/parseJSONFile')(__dirname + '/manifest.json'),
	model = require('./model'),
	views = {
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
	res.render(views.form, {
		inModal: req.headers['x-requested-with'] == 'XMLHttpRequest',
		formData: merge(manifest.fields, {
			method: 'post',
			action: '/users/add/'
		})
	});
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var formPost = function(req, res){
	model.save(req.body, function(err, doc){
		if (err){
			return res.json(503, {
				error: {
					code: 'ESHITHITFAN',
					message: 'Shit hit the fan'
				}
			});
		}

		res.json(201, doc);
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
	formPost: formPost,
	detail: detail
};
