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
					create: ['public/css/']
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
			}
		}
	});

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-sass');
	grunt.registerTask('default', ['mkdir', 'sass:dev', 'concurrent:dev']);
};

