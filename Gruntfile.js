'use strict';

module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		nodemon: {
			dev: {}
		}
	});

	grunt.loadNpmTasks('grunt-nodemon');
	grunt.registerTask('default', ['nodemon:dev']);
};

