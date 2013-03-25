module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    packageInfo: grunt.file.readJSON('package.json'),

    clean: ['build'],

    uglify: {
      dist: {
        files: {
          'build/all.js': [
            'js/localizer.js',
            'js/sputil.js',
            'js/dbmanager.js',
            'js/spscroller.js',
            'js/spscrollbar.js',
            'js/newpopout.js',
            'js/photospage.js',
            'js/finishpopout.js',
            'js/leaderboardpage.js',
            'js/pausepopout.js',
            'js/pausebackground.js',
            'js/puzzlepausefullimage.js',
            'js/license.js',
            'js/slider-puzzle.js',
            'js/main.js'
          ]
        }
      }
    },

    concat: {
      dist: {
        src: [
        ],

        dest: 'build/dist/all.js',

        separator: ';'
      }
    },

    // copy assets and the index.html file to build/dist;
    // NB we rewrite index.html during copy to point at the
    // minified/concated dist js file all.js
    copy: {
      dist: {
        files: [
          { expand: true, cwd: 'app/', src: ['index.html'], dest: 'build/dist/' },
          { expand: true, cwd: 'app/', src: ['assets/**'], dest: 'build/dist/' }
        ],
        options: {
          // this rewrites the <script> tag in the index.html file
          // to point at the minified/concated js file all.js;
          // it also removes the extraneous data-main attribute
          // on that script tag, used by full-blown require
          processContent: function (content) {
            if (content.match(/DOCTYPE/)) {
              content = content.replace(/lib\/require\/require.*\.'js/, 'all.js');
              content = content.replace(/data-main=".*" /, '');
            }

            return content;
          }
        }
      }
    },

    package: {
      appName: '<%= packageInfo.name %>',
      version: '<%= packageInfo.version %>',
      files: 'build/dist/**',
      stripPrefix: 'build/dist/',
      outDir: 'build',
      addGitCommitId: true
    }
  });

  grunt.registerTask('dist', ['uglify:dist', 'concat:dist', 'copy:dist']);

  grunt.registerTask('pkg', 'Create package; call with pkg:STR to append STR to package name', function (identifier) {
    grunt.task.run('dist');

    var packageTask = (identifier ? 'package:' + identifier : 'package');
    grunt.task.run(packageTask);
  });

  grunt.registerTask('default', 'dist');
};
