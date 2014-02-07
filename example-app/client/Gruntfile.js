var path = require('path');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),

    /**
     * precompile template assets
     */
    ember_handlebars: {
      options: {
          processName: function(filePath) {
            return filePath.replace('app/templates/', '').replace('.hbs', '');
          }
      },
      compile: {
        files: {
          'public/dist/templates.js': 'app/templates/**/*.hbs'
        }
      }
    },

    /**
     * concat all js files needed for app into one
     */
    concat: {
      dist: {
        src : [
          'app/core/socket.io.js',
          'app/core/jquery.js',
          'app/core/handlebars.js',
          'app/core/ember.js',
          'app/core/ember-model.js',
          'app/core/ember-session.js',
          'public/dist/templates.js',
          'app/app.js',
          'app/router.js',
          'app/adapter.js',
          'app/routes/**/*.js',
          'app/models/**/*.js',
          'app/controllers/**/*.js',
          'app/views/**/*.js'
        ],
        dest : 'public/dist/app.js'
      }
    },

    /**
     * uglify the js file for dist
     */
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        },
        report: 'gzip',
        compress: {
          drop_console: true
        },
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      my_target:{
        files: {
          'public/dist/app.js' : [
            'public/dist/app.js'
          ]
        }
      }
    },

    /**
     * watch js and hbs files for change
     */
    watch: {
      templates: {
        files: [
          'app/templates/**/*.hbs',
          'app/templates/*.hbs'
        ],
        tasks: ['ember_handlebars', 'concat']
      },
      scripts: {
        files: [
          'app/helpers/*.js',
          'app/app.js',
          'app/router.js',
          'app/adapter.js',
          'app/core/**/*.js',
          'app/helpers/**/*.js',
          'app/routes/**/*.js',
          'app/controllers/**/*.js',
          'app/models/**/*.js',
          'app/views/**/*.js',
          '!public/dist/**/*.js'
        ],
        tasks: ['concat']
      },
      less: {
        files: [
          'app/styles/**/*.less',
          'app/styles/*.less'
        ],
        tasks: ['less']
      },
      livereload: {
        files: [
          'public/dist/app.css',
          'public/dist/app.js',
        ],
        options: {
          livereload: true
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'public/dist/index.html': 'app/index.html'
        }
      }
    },

    less: {
      dev: {
        options: {
          paths: ["app/styles"],
          compress: true,
          cleancss: true
        },
        files: {
          "public/dist/app.css": "app/styles/theme.less"
        }
      }
    }

  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ember-handlebars');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // define custom tasks
  grunt.registerTask('default', ['ember_handlebars', 'concat', 'less', 'htmlmin', 'watch']);
  grunt.registerTask('dist', ['ember_handlebars', 'concat', 'less','uglify', 'htmlmin']);
}