/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['dust', 'Q'], function (dust, Q) {
  'use strict';

  // format a date time to HH:MM
  // timeToFormat: time in ms
  var dateFilter = function (timeToFormat) {
    var date = new Date(timeToFormat);

    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return '' + minutes + ':' + seconds;
  };

  return function (templateName, data) {
    var dfd = Q.defer();
    data = data || {};

    var dustRender = function (dustToRenderWith) {
      if (!dustToRenderWith.filters.dateFilter) {
        dustToRenderWith.filters.dateFilter = dateFilter;
      }

      dustToRenderWith.render(templateName, data, function (err, output) {
        if (err) {
          dfd.reject(err);
        }
        else {
          dfd.resolve(output);
        }
      });
    };

    // if we don't have a dust cache with the template in it, we load
    // the full version of dust and use that to compile the template
    // on the fly
    if (!dust.cache.hasOwnProperty(templateName)) {
      var filename = '../templates/' + templateName + '.dust';

      require(['text!' + filename, 'dust-full'], function (template, dustFull) {
        var compiled = dustFull.compile(template, templateName);
        dustFull.loadSource(compiled);
        dustRender(dustFull);
      });
    }
    // if the template is in the cache, we don't need to load the HTML
    // file, and we can just render the template
    else {
      dustRender(dust);
    }

    return dfd.promise;
  };
});
