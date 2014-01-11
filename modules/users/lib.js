'use strict';

var client = require('mongodb').MongoClient,
	bcrypt = require('bcrypt'),
	config = require('./../../lib/config')('/modules/users/config.json'),
	User = require('./model');

/**
 * Sign a new user up
 * @param {String} email
 * @param {String} password
 * @param {Function} fn
 */
var signup = function(email, password, fn){
	if (!email || !password){
		fn(new Error('E-mail or password not provided'));
		return;
	}

	if (!/[^@]+@[^.]+(.[^.]+)+/.test(email)){
		fn(new Error('Email not valid'));
		return;
	}

	client.connect(config.db, function(err, db){
		if (err){
			console.log('Failed to connect to MongoDB');
			fn(new Error('Failed to connect to MongoDB'));
			return;
		}

		var collection = db.collection('user');
		collection.findOne({email: email}, function(err, doc){
			if (err){
				db.close();
				fn(new Error('Failed to query collection'));
				return;
			}

			if (doc){
				db.close();
				fn(new Error('E-mail is already registered'));
				return;
			}

			bcrypt.hash(password, 10, function(err, hash){
				if (err){
					db.close();
					fn(new Error('Failed to hash password'));
					return;
				}

				var data = {
					email: email,
					password: hash
				};
				collection.insert(data, function(err){
					db.close();
					if (err){
						fn(new Error('Failed to insert data into MongoDB'));
						return;
					}
					fn(null, data);
				});
			});
		});
	});
};

/**
 * Log a user in
 * @param {String} email
 * @param {String} password
 * @param {Function} fn
 */
var login = function(email, password, fn){
	if (!email || !password){
		fn(new Error('E-mail or password not provided'));
		return;
	}

	client.connect(config.db, function(err, db){
		if (err){
			console.log('Failed to connect to MongoDB');
			fn(new Error('Failed to connect to MongoDB'));
			return;
		}

		var collection = db.collection('user');
		collection.findOne({email: email}, function(err, doc){
			db.close();
			if (err){
				fn(new Error('Failed to query collection'));
				return;
			}

			if (!doc){
				fn(new Error('Could not find user with that email'));
				return;
			}

			bcrypt.compare(password, doc.password, function(err, equal){
				if (err){
					fn(new Error('Failed to do bcrypt compare'));
					return;
				}

				if (!equal){
					fn(new Error('Incorrect password'));
					return;
				}

				fn(null, new User(doc));
			});
		});
	});
};

module.exports = {
	signup: signup,
	login: login
};

