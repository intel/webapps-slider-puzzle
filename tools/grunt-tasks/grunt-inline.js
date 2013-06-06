/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/*
 * Inline a JS file at the end of an HTML file
 * (just before the closing </body> tag)
 *
 * Configure with grunt.initConfig(), e.g.
 *
 * grunt.initConfig({
 *   inline: {
 *     script: '<path to script file>',
 *     htmlFile: '<path to HTML file>'
 *   }
 * });
 */
module.exports = function (grunt) {
  var fs = require('fs');

  grunt.registerMultiTask('inline', 'Append script to HTML file', function () {
    var script = this.data.script;
    var htmlFile = this.data.htmlFile;
    var position = this.data.position || 'body';

    if (!script) {
      grunt.fail('inline task requires script property');
    }

    if (!htmlFile) {
      grunt.fail('inline task requires "htmlFile" property');
    }

    var js = fs.readFileSync(script, 'utf8');

    var html = fs.readFileSync(htmlFile, 'utf8');
    var htmlFragment = '<script>' + js + '</script></' + position + '>';
    html = html.replace('</' + position + '>', htmlFragment);

    fs.writeFileSync(htmlFile, html);
  });
};
