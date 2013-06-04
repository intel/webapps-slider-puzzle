/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['Q'], function (Q) {
  'use strict';

  var URL = window.URL || window.webkitURL;
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia;

  // HTML5 camera integration
  var Camera = function (videoElt) {
    this.videoElt = videoElt;
  };

  Camera.prototype.init = function () {
    var videoElt = this.videoElt;
    var dfd = Q.defer();

    var readyListener = function () {
      dfd.resolve();
      videoElt.removeEventListener('loadedmetadata', readyListener);
    };

    navigator.getUserMedia(
      { video: true },

      function (stream) {
        videoElt.addEventListener('loadedmetadata', readyListener);
        videoElt.src = URL.createObjectURL(stream);
      },

      function (e) {
        console.error(e);
        dfd.reject(e);
      }
    );

    return dfd.promise;
  };

  return Camera;
});
