module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadTasks('tools/grunt-tasks');

  grunt.initConfig({
    packageInfo: grunt.file.readJSON('package.json'),

    clean: ['build'],

    // minify and concat JS
    uglify: {
      dist: {
        files: {
          'build/app/js/all.js': [
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

    // minify and concat CSS
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

    // copy assets and the index.html file to build/app/;
    // NB we rewrite index.html during copy to point at the
    // minified/concated js file all.js and minified/concated CSS file
    // all.css
    copy: {
      common: {
        files: [
          { expand: true, cwd: '.', src: ['audio/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['db/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['config.xml'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['fonts/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['icon_128.png'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['images/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['pages.html'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['lib/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['LICENSE'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['README.txt'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['_locales/**'], dest: 'build/app/' }
        ]
      },
      sdk: {
        files: [
          { src: 'index.html', dest: 'build/sdk/index.html' },
          { expand: true, cwd: 'build/app', src: '**', dest: 'build/sdk/' },
          { expand: true, cwd: 'js', src: ['**'], dest: 'build/sdk/js/' },
          { expand: true, cwd: 'css', src: ['**'], dest: 'build/sdk/css/' }
        ]
      },
      wgt: {
        files: [
          { expand: true, cwd: 'build/app', src: '**', dest: 'build/wgt/' }
        ]
      },
      condensedIndex: {
        files: [
          { expand: true, cwd: '.', src: ['index.html'], dest: 'build/wgt/' }
        ],
        options: {
          // this rewrites the <script> tag in the index.html file
          // to point at the minified/concated js file all.js;
          // and the stylesheet tags to point at all.css;
          // it additionally strips out as much space and as many newlines
          // as possible from text files (NB this may be dangerous if
          // files are space-sensitive, but most JS, CSS and HTML shouldn't be)
          processContent: function (content) {
            if (content.match(/DOCTYPE/)) {
              // JS
              content = content.replace(/js\/main.js/, 'all.js');
              content = content.replace(/<script src="js\/.+?"><\/script>\n/g, '');
              content = content.replace(/all\.js/, 'js/all.js');

              // CSS
              content = content.replace(/css\/license.css/, 'all.css');
              content = content.replace(/<link rel="stylesheet" href="css\/.+?">\n/g, '');
              content = content.replace(/all\.css/, 'css/all.css');

              // whitespace reduction
              content = content.replace(/[ ]{2,}/g, ' ');
              content = content.replace(/\n{2,}/g, '\n');
            }

            return content;
          }
        }
      }
    },

    // make wgt package in build/ directory
    package: {
      wgt: {
        appName: '<%= packageInfo.name %>',
        version: '<%= packageInfo.version %>',
        files: 'build/wgt/**',
        stripPrefix: 'build/wgt/',
        outDir: 'build',
        suffix: '.wgt',
        addGitCommitId: false
      },
      sdk: {
        appName: '<%= packageInfo.name %>',
        version: '<%= packageInfo.version %>',
        files: 'build/sdk/**',
        stripPrefix: 'build/sdk/',
        outDir: 'build',
        suffix: '.wgt',
        addGitCommitId: false
      }
    },

    sdb: {
      prepare: {
        action: 'push',
        localFiles: './tools/grunt-tasks/tizen-app.sh',
        remoteDestDir: '/home/developer/',
        chmod: '+x',
        overwrite: true
      },

      pushwgt: {
        action: 'push',
        localFiles: {
          pattern: 'build/*.wgt',
          filter: 'latest'
        },
        remoteDestDir: '/home/developer/'
      },

      stop: {
        action: 'stop',
        remoteScript: '/home/developer/tizen-app.sh'
      },

      uninstall: {
        action: 'uninstall',
        remoteScript: '/home/developer/tizen-app.sh'
      },

      install: {
        action: 'install',
        remoteFiles: {
          pattern: '/home/developer/*.wgt',
          filter: 'latest'
        },
        remoteScript: '/home/developer/tizen-app.sh'
      },

      debug: {
        action: 'debug',
        remoteScript: '/home/developer/tizen-app.sh',
        localPort: '8888',
        openBrowser: 'google-chrome %URL%'
      },

      start: {
        action: 'start',
        remoteScript: '/home/developer/tizen-app.sh'
      }
    }
  });

  grunt.registerTask('wgt', [
    'clean',
    'cssmin:dist',
    'uglify:dist',
    'copy:common',
    'copy:condensedIndex',
    'copy:wgt',
    'package:wgt'
  ]);

  grunt.registerTask('sdk', [
    'clean',
    'copy:common',
    'copy:sdk',
    'package:sdk'
  ]);

  grunt.registerTask('install', [
    'sdb:prepare',
    'sdb:pushwgt',
    'sdb:stop',
    'sdb:uninstall',
    'sdb:install',
    'sdb:start'
  ]);

  grunt.registerTask('restart', ['sdb:stop', 'sdb:start']);

  grunt.registerTask('wgt-install', ['wgt', 'install']);
  grunt.registerTask('sdk-install', ['sdk', 'install']);

  grunt.registerTask('default', 'wgt');
};
