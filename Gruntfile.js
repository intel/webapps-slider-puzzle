module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadTasks('tools/grunt-tasks');

  grunt.initConfig({
    packageInfo: grunt.file.readJSON('package.json'),

    clean: ['build'],

    uglify: {
      dist: {
        files: {
          'build/app/all.js': [
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
            'js/ui-event-handlers.js',
            'js/main.js'
          ]
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'build/app/css/all.css': [
            'css/openscreen.css',
            'css/quickstart.css',
            'css/pausescreen.css',
            'css/leaderboardpage.css',
            'css/photospage.css',
            'css/finishscreen.css',
            'css/license.css'
          ]
        }
      }
    },

    // copy assets and the index.html file to build/dist;
    // NB we rewrite index.html during copy to point at the
    // minified/concated dist js file all.js
    copy: {
      dist: {
        files: [
          { expand: true, cwd: '.', src: ['audio/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['db/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['config.xml'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['fonts/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['icon_128.png'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['images/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['index.html'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['lib/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['LICENSE'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['_locales/**'], dest: 'build/app/' }
        ],
        options: {
          // this rewrites the <script> tag in the index.html file
          // to point at the minified/concated js file all.js
          processContent: function (content) {
            if (content.match(/DOCTYPE/)) {
              content = content.replace(/js\/main.js/, 'all.js');
              content = content.replace(/<script src="js\/.+?"><\/script>\n/g, '');

              content = content.replace(/css\/license.css/, 'all.css');
              content = content.replace(/<link rel="stylesheet" href="css\/.+?">\n/g, '');
              content = content.replace(/all\.css/, 'css/all.css');

              content = content.replace(/[ ]{2,}/g, ' ');
              content = content.replace(/\n{2,}/g, '\n');
            }

            return content;
          },

          processContentExclude: ['images/**', 'icon_128.png', 'fonts/**', 'audio/**']
        }
      }
    },

    package: {
      appName: '<%= packageInfo.name %>',
      version: '<%= packageInfo.version %>',
      files: 'build/app/**',
      stripPrefix: 'build/app/',
      outDir: 'build',
      suffix: '.wgt',
      addGitCommitId: false
    }
  });

  grunt.registerTask('dist', ['clean', 'cssmin:dist', 'uglify:dist', 'copy:dist']);

  grunt.registerTask('pkg', 'Create package; call with pkg:STR to append STR to package name', function (identifier) {
    grunt.task.run('dist');

    var packageTask = (identifier ? 'package:' + identifier : 'package');
    grunt.task.run(packageTask);
  });

  grunt.registerTask('default', 'dist');
};
