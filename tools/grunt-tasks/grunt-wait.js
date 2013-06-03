/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/*
 * This task is useful if you are running some process which you
 * can't time (e.g. starting a Tizen app and waiting to see the UI
 * displayed on the device screen)
 *
 * config options:
 *
 *   seconds: number of seconds to wait
 */
module.exports = function (grunt) {
  grunt.registerMultiTask('wait', 'Pause grunt for a number of seconds', function () {
    var waitSeconds = parseInt(this.data.seconds);

    if (!waitSeconds) {
      grunt.fail('wait task requires a "seconds" config property');
    }

    var done = this.async();

    grunt.log.ok('waiting for ' + waitSeconds + ' seconds');

    setTimeout(function () {
      done();
    }, waitSeconds * 1000);
  });
};
