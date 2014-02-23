'use strict';

module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		mkdir: {
			all: {
				options: {
					create: ['public/css/', 'public/js']
				}
			}
		},

		nodemon: {
			dev: {}
		},

		sass: {
			dev: {
				files: {
					'public/css/omni.css': 'src/css/omni.scss'
				}
			}
		},

		watch: {
			css: {
				files: [
					'src/css/*.scss', 'src/css/**/*.scss'
				],
				tasks: ['sass:dev']
			},
			js: {
				files: [
					'src/js/*.js',
					'src/js/**/*.js',
					'src/js/**/**/*.js',
					'node_modules/informal/*.js',
					'node_modules/informal/**/*.js'
				],
				tasks: ['wrapup:dev']
			}
		},

		wrapup: {
			dev: {
				requires: {
					'./src/js/omni.js': true
				},
				options: {
					'output': './public/js/omni.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-wrapup');

	grunt.registerTask('default', [
		'mkdir',
		'sass:dev',
		'wrapup:dev',
		'concurrent:dev'
	]);
};
