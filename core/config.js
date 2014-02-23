'use strict';

var cons = require('consolidate'),
	express = require('express'),
	connect = require('connect'),
	RedisStore = require('connect-redis')(connect),
	app = require('./app');

app
	.engine('html', cons.swig)
	.set('view engine', 'html')
	.set('views', __dirname + '/../views')
	.use(express.static(__dirname + '/../public'))
	.use(require('connect-slashes')())
	.use(express.bodyParser())
	.use(express.cookieParser())
	.use(express.session({
		store: new RedisStore(),
		secret: 'my_secret_string',
		key: 'omni'
	}))
	.locals({
		title: 'Omni'
	});
