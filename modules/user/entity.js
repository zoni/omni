'use strict';

/**
 * Create a new User entity
 * @param {Object} data
 */
var User = function(data){
	if (!(this instanceof User)){
		return new User(data);
	}

	this.data = data;
};

/**
 * Return a subset of data that may to be publically available
 * @return {Object}
 */
User.prototype.getPublicData = function(){
	return {
		_id: this.data._id.toString(),
		email: this.data.email
	};
};

module.exports = User;
