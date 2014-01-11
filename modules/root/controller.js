'use strict';

var userLib = require('./../users/lib');

/**
 *
 */
var index = function(req, res){
	var locals = {},
		view = 'index';

	if (!req.session.user){
		locals = {action: '/login'};
		view = 'forms/login';
	}

	res.render(view, locals);
};

/**
 *
 */
var signup = function(req, res){
	if (req.session.user){
		res.redirect('/');
		return;
	}

	var locals = {action: '/signup'},
		view = 'forms/signup';
	res.render(view, locals);
};

/**
 *
 */
var signupPost = function(req, res){
	if (!req.body.email || !req.body.password){
		console.log('Email or password missing');
		return;
	}

	userLib.signup(req.body.email, req.body.password, function(err){
		if (err){
			var locals = {
				action: '/signup',
				error: err.message
			};
			res.render('forms/signup', locals);
			return;
		}

		res.redirect('/');
	});
};

/**
 *
 */
var login = function(req, res){
	if (req.session.user){
		res.redirect('/');
		return;
	}

	var locals = {action: '/login'},
		view = 'forms/login';
	res.render(view, locals);
};

/**
 *
 */
var loginPost = function(req, res){
	if (!req.body.email || !req.body.password){
		console.log('Email or password missing');
		return;
	}

	userLib.login(req.body.email, req.body.password, function(err, user){
		if (err){
			var locals = {
				action: '/signup',
				error: err.message
			};
			res.render('forms/signup', locals);
			return;
		}

		req.session.user = user.getPublicData();
		res.redirect('/');
	});
};

module.exports = {
	index: index,
	signup: signup,
	signupPost: signupPost,
	login: login,
	loginPost: loginPost
};

