/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['Q', 'lodash'], function (Q, _) {
  'use strict';

  var onTizen = (typeof tizen !== 'undefined');

  var URL = window.URL || window.webkitURL;
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia;

  // HTML5 camera integration
  var Camera = function (videoElt, canvasElt) {
    this.videoElt = videoElt;
    this.canvasElt = canvasElt;
    this.ctx = this.canvasElt.getContext('2d');
  };

  // size the canvas element to the dimensions of the video
  Camera.prototype.resize = function () {
    if (onTizen) {
      // HACK on Tizen, rotate the video element
      this.videoElt.style['-webkit-transform-origin'] = '50% 50%';
      this.videoElt.style['-webkit-transform'] = 'rotateZ(90deg)';

      // the video is rotated, so we use the opposing
      // axes to set height and width
      this.canvasElt.height = this.videoElt.videoWidth;
      this.canvasElt.width = this.videoElt.videoHeight;
    }
    else {
      this.canvasElt.width = this.videoElt.videoWidth;
      this.canvasElt.height = this.videoElt.videoHeight;
    }
  };

  Camera.prototype.init = function () {
    var self = this;
    var dfd = Q.defer();
    var videoElt = this.videoElt;

    var readyListener = function () {
      self.resize();
      dfd.resolve();
      videoElt.removeEventListener('loadedmetadata', readyListener);
    };

    navigator.getUserMedia(
      { video: true },

      function (stream) {
        videoElt.addEventListener('loadedmetadata', readyListener);
        videoElt.src = URL.createObjectURL(stream);
      },

      dfd.reject
    );

    return dfd.promise;
  };

  // save the video onto the canvas;
  // on Tizen, because the camera is rotated, we rotate the canvas,
  // then draw onto it, then rotate it back, to capture the image
  // in the correct orientation
  Camera.prototype.snapshot = function () {
    var dfd = Q.defer();

    var drawWidth = this.videoElt.videoWidth;
    var drawHeight = this.videoElt.videoHeight;
    var halfCanvasWidth = this.canvasElt.width / 2;
    var halfCanvasHeight = this.canvasElt.height / 2;

    if (onTizen) {
      this.ctx.translate(halfCanvasWidth, halfCanvasHeight);
      this.ctx.rotate(Math.PI / 2);
      this.ctx.translate(-halfCanvasWidth, -halfCanvasHeight);

      var xOffset = ((halfCanvasWidth * 2) - drawWidth) / 2;
      var yOffset = ((halfCanvasHeight * 2) - drawHeight) / 2;

      this.ctx.drawImage(this.videoElt, xOffset, yOffset, drawWidth, drawHeight);

      this.ctx.translate(halfCanvasWidth, halfCanvasHeight);
      this.ctx.rotate(-(Math.PI / 2));
      this.ctx.translate(-halfCanvasWidth, -halfCanvasHeight);
    }
    else {
      this.ctx.drawImage(this.videoElt, 0, 0, drawWidth, drawHeight);
    }

    dfd.resolve();

    return dfd.promise;
  };

  // return the content of the canvas as a blob
  Camera.prototype.getBlob = function () {
    var mimeType = 'image/png';

    var dataUri = this.canvasElt.toDataURL(mimeType, 0.5);
    var bytes = atob(dataUri.split(',')[1]);

    var byteArray = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) {
      byteArray[i] = bytes.charCodeAt(i);
    }

    return new Blob([byteArray], {type: mimeType});
  };

  return Camera;
});
