/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/*
 * Strip all inline script elements from an HTML file
 *
 * Configure with grunt.initConfig(), e.g.
 *
 * grunt.initConfig({
 *   inlineStrip: {
 *     htmlFile: '<path to HTML file>'
 *   }
 * });
 */
module.exports = function (grunt) {
  var fs = require('fs');

  grunt.registerMultiTask('inlineStrip', 'Strip inline scripts from HTML file', function () {
    var htmlFile = this.data.htmlFile;

    if (!htmlFile) {
      grunt.fail('inlineStrip task requires "htmlFile" property');
    }

    var html = fs.readFileSync(htmlFile, 'utf8');

    html = html.replace(/<script>.+?<\/script>/gm, '');

    fs.writeFileSync(htmlFile, html);
  });
};
