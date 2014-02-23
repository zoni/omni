'use strict';

var client = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
	bcrypt = require('bcrypt'),
	isFunction = require('mout/lang/isFunction'),
	parseJSON = require('../../../lib/parseJSONFile'),
	config = parseJSON(process.cwd() + '/config.json');

/**
 * @param {Object} data
 * @param {Function} fn
 */
var save = function(data, fn){
	if (!data.email || !data.password){
		fn(new Error('E-mail or password not provided'));
		return;
	}

	if (!/[^@]+@[^.]+(.[^.]+)+/.test(data.email)){
		fn(new Error('Email not valid'));
		return;
	}

	client.connect(config.db, function(err, db){
		if (err){
			console.log('Failed to connect to MongoDB');
			return fn(new Error('Failed to connect to MongoDB'));
		}

		var collection = db.collection('user');
		collection.findOne({email: data.email}, function(err, doc){
			if (err){
				db.close();
				return fn(new Error('Failed to query collection'));
			}

			if (doc){
				db.close();
				return fn(new Error('E-mail is already registered'));
			}

			bcrypt.hash(data.password, 10, function(err, hash){
				if (err){
					db.close();
					return fn(new Error('Failed to hash password'));
				}

				var doc = {
					email: data.email,
					password: hash
				};
				collection.insert(doc, function(err){
					db.close();
					if (err){
						return fn(new Error('Failed to insert document into MongoDB'));
					}
					fn(null, doc);
				});
			});
		});
	});
};

/**
 * @param {Object} query
 * @param {Function} fn
 */
var find = function(query, fn){
	if (isFunction(query)){
		fn = query;
		query = null;
	}

	client.connect(config.db, function(err, db){
		if (err){
			console.log('Failed to connect to MongoDB');
			fn(new Error('Failed to connect to MongoDB'));
			return;
		}

		var collection = db.collection('user');
		collection.find(query).toArray(function(err, docs){
			db.close();
			if (err){
				fn(new Error('Failed to query collection'));
				return;
			}

			for (var i = 0; i < docs.length; i++){
				docs[i]._id = docs[i]._id.toString();
			}

			fn(null, docs);
		});
	});
};

/**
 * @param {Object} query
 * @param {Function} fn
 */
var read = function(query, fn){
	if (query._id){
		query._id = new ObjectID(query._id);
	}

	client.connect(config.db, function(err, db){
		if (err){
			console.log('Failed to connect to MongoDB');
			fn(new Error('Failed to connect to MongoDB'));
			return;
		}

		var collection = db.collection('user');
		collection.findOne(query, function(err, doc){
			db.close();
			if (err){
				fn(new Error('Failed to query collection'));
				return;
			}

			if (!doc){
				fn(new Error('No matching documents found'));
				return;
			}

			doc._id = doc._id.toString();
			fn(null, doc);
		});
	});
};

/**
 * @param {Object} query
 * @param {Function} fn
 */
var remove = function(query, fn){
	console.log(query, fn);
};

/**
 *
 */
var signup = function(email, password, fn){
	save({
		email: email,
		password: password
	}, fn);
};

module.exports = {
	save: save,
	find: find,
	read: read,
	remove: remove,
	signup: signup
};
