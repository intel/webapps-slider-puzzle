/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
require.config({
  baseUrl: './js',

  deps: ['main'],

  paths: {
    'lodash': '../lib/lodash/dist/lodash.underscore',
    'Q': '../lib/q/q',
    'stapes': '../lib/stapes/stapes',
    'dust': '../lib/dustjs-linkedin/dist/dust-core-2.2.0',
    'dust-full': '../lib/dustjs-linkedin/dist/dust-full-2.2.0',
    'fastclick': '../lib/fastclick/lib/fastclick',
    'rye': '../lib/rye/dist/rye-base-0.1.0',
    'hammer': '../lib/hammerjs/dist/hammer',
    'i18n': '../lib/requirejs-i18n/i18n',
    'domReady': '../lib/requirejs-domready/domReady',
    'text': '../lib/requirejs-text/text'
  },

  shim: {
    'dust': {
      exports: 'dust'
    },
    'dust-full': {
      exports: 'dust'
    },
    'rye': {
      exports: 'Rye'
    }
  }
});

// this is here as the r.js optimiser uses the first require.config
// call in the file to configure its build (i.e. to minify and concat
// all the JS files used by the app via require); the argument passed
// to that first call must be valid JSON, and the below config is not
var urlArgs = (document.location.href.match(/nocache/) ?
               'bust=' + (new Date()).getTime() :
               '');

require.config({urlArgs: urlArgs});
