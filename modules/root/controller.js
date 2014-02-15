'use strict';

var auth = require('./../auth/lib'),
	userModel = require('./../user/model');

/**
 * @param {Object} req
 * @param {Object} res
 */
var index = function(req, res){
	var locals = {},
		view = 'index';

	if (!req.session.user){
		locals = {action: '/login/'};
		view = 'forms/login';
	}

	res.render(view, locals);
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var signup = function(req, res){
	if (req.session.user){
		res.redirect('/');
		return;
	}

	var locals = {action: '/signup/'},
		view = 'forms/signup';
	res.render(view, locals);
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var signupPost = function(req, res){
	if (!req.body.email || !req.body.password){
		var locals = {
			action: '/signup/',
			error: 'Email or password missing'
		};
		res.render('forms/signup', locals);
		return;
	}

	userModel.signup(req.body.email, req.body.password, function(err){
		if (err){
			var locals = {
				action: '/signup/',
				error: err.message
			};
			res.render('forms/signup', locals);
			return;
		}

		res.redirect('/');
	});
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var login = function(req, res){
	if (req.session.user){
		res.redirect('/');
		return;
	}

	var locals = {action: '/login/'},
		view = 'forms/login';
	res.render(view, locals);
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var loginPost = function(req, res){
	if (!req.body.email || !req.body.password){
		var locals = {
			action: '/login/',
			error: 'Email or password missing'
		};
		res.render('forms/login', locals);
		return;
	}

	auth.byPassword(req.body.email, req.body.password, function(err, user){
		if (err){
			var locals = {
				action: '/login/',
				error: err.message
			};
			res.render('forms/login', locals);
			return;
		}

		req.session.user = user.getPublicData();
		res.redirect('/');
	});
};

/**
 * @param {Object} req
 * @param {Object} res
 */
var logout = function(req, res){
	delete req.session.user;
	res.redirect('/');
};

module.exports = {
	index: index,
	signup: signup,
	signupPost: signupPost,
	login: login,
	loginPost: loginPost,
	logout: logout
};
