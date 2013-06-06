/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
window.addEventListener('load', function () {
  window.perf = function () {
    var perfData = localStorage.getItem('perf-data');
    console.log(perfData);
  };

  setTimeout(function () {
    var perfData = localStorage.getItem('perf-data');
    if (!perfData) {
      perfData = [];
    }
    else {
      perfData = JSON.parse(perfData);
    }

    perfData.push(performance.timing);
    localStorage.setItem('perf-data', JSON.stringify(perfData));
  }, 2000);
});
