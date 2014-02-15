'use strict';

var client = require('mongodb').MongoClient,
	bcrypt = require('bcrypt'),
	config = require('./../../lib/config')(process.cwd() + '/config.json'),
	User = require('./../user/entity');

/**
 * Authenticate by email and password
 * @param {String} email
 * @param {String} password
 * @param {Function} fn
 */
var byPassword = function(email, password, fn){
	if (!email || !password){
		fn(new Error('E-mail or password not provided'));
		return;
	}

	client.connect(config.db, function(err, db){
		if (err){
			return fn(new Error('Failed to connect to MongoDB'));
		}

		var collection = db.collection('user');
		collection.findOne({email: email}, function(err, doc){
			db.close();
			if (err){
				return fn(new Error('Failed to query collection'));
			}

			if (!doc){
				return fn(new Error('Could not find user with that email'));
			}

			bcrypt.compare(password, doc.password, function(err, equal){
				if (err){
					return fn(new Error('Failed to do bcrypt compare'));
				}

				if (!equal){
					return fn(new Error('Incorrect password'));
				}

				fn(null, new User(doc));
			});
		});
	});
};

module.exports = {
	byPassword: byPassword
};

