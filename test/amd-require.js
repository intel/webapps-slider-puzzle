/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

// replace the node.js require() with an AMD-compatible one,
// set up with the correct paths for modules used by the browser;
// this requires an absolutely massive hack to extract the AMD
// configuration from the amd-config.js file, and massage it so it
// will work outside the browser with the correct paths
//
// to use in a test, load standard node modules first:
//   var fs = require('fs');
//
// then load this module, which replaces node's require with an AMD
// require:
//
//   require = require('./amd-require');
//   var myModule = require('myModule');
//
// note that the path myModule is relative to ../app/js (to enable all
// the modules in the app to be loaded as is); myModule will now contain
// an object you can test against
//
// NB it looks like requirejs may do some fancy footwork so that the
// node require() continues to work, but I'm loading node modules
// first just in case
var fs = require('fs');
var path = require('path');

// this gets requirejs to use the same paths and shims
// set up for the browser; oh the massive hackery...
var amdConfig = path.resolve(__dirname, '../app/js/amd-config.js');
var requireConfig = fs.readFileSync(amdConfig, 'utf8');

// here we're finding the object passed to the first call to require.config()
var configStr = requireConfig.match(/require\.config\((\{[\w\W]+?\})\);/m)[1];

// now we make a variable containing that object
eval('var config = ' + configStr);

// and butcher it
config.baseUrl = path.resolve(__dirname, '../app/js');
config.deps = [];

// replace node's require with requirejs
var amdRequire = require('requirejs');

// configure it
amdRequire.config(config);

// export it
module.exports = amdRequire;
