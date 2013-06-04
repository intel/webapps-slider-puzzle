/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['Q', 'rye', 'dust-render', 'page', 'camera', 'i18n!../../nls/strings'],
function (Q, $, render, Page, Camera, translations) {
  'use strict';

  return Page({
    elt: null,

    templateName: 'photobooth',

    webcam: null,

    snapshot: null,

    title: null,

    showWebcam: function () {
      if (this.webcam && this.snapshot && this.title) {
        this.webcam.attr('data-photobooth-webcam-on', 'true');
        this.snapshot.attr('data-photobooth-snapshot-on', 'false');

        this.title.find('span[data-photobooth-snapshot-on]')
                  .attr('data-photobooth-snapshot-on', 'false');

        this.title.find('span[data-photobooth-webcam-on]')
                  .attr('data-photobooth-webcam-on', 'true');
      }
    },

    showSnapshot: function () {
      if (this.webcam && this.snapshot && this.title) {
        this.webcam.attr('data-photobooth-webcam-on', 'false');
        this.snapshot.attr('data-photobooth-snapshot-on', 'true');

        this.title.find('span[data-photobooth-snapshot-on]')
                  .attr('data-photobooth-snapshot-on', 'true');

        this.title.find('span[data-photobooth-webcam-on]')
                  .attr('data-photobooth-webcam-on', 'false');
      }
    },

    // TODO show an error returned by the camera object
    showSnapshotError: function () {
    },

    init: function (eltIn) {
      var dfd = Q.defer();
      var self = this;

      this.parentElt = $(eltIn);

      var data = {
        translations: translations
      };

      render(this.templateName, data).then(function (html) {
        self.parentElt.append(html);
        self.elt = self.parentElt.find('[data-page=photobooth]');

        // set up the camera
        var video = self.elt.find('video');
        var videoElt = video.get(0);
        var canvas = self.elt.find('canvas');
        var canvasElt = canvas.get(0);
        var camera = new Camera(videoElt, canvasElt);

        // build page UI
        self.enableNavButtons();

        // elements holding the video, canvas and title
        self.webcam = self.elt.find('.photobooth-webcam');
        self.snapshot = self.elt.find('.photobooth-snapshot');
        self.title = self.elt.find('h1');

        // get the camera ready
        camera.init()
        .then(
          function () {
            // add tap listener to the webcam
            self.webcam.on('click', function () {
              // take a snapshot, hide the video element, show the
              // snapshot in the canvas element
              camera.snapshot().then(
                self.showSnapshot.bind(self),
                self.showSnapshotError.bind(self)
              );
            });

            // keep photo buttons: yes/no
            var yesBtn = self.elt.find('[data-photobooth-keep="yes"]');
            yesBtn.on('click', function () {
              var blob = camera.getBlob();
              console.log(blob);

              // TODO save blob

              self.showWebcam();
            });

            var noBtn = self.elt.find('[data-photobooth-keep="no"]');
            noBtn.on('click', self.showWebcam.bind(self));

            dfd.resolve(self);
          },
          function (e) {
            console.error(e);
            dfd.reject(e);
          }
        )
        .done();
      });

      return dfd.promise;
    },

    show: function () {
      this.showWebcam();
      this.elt.removeClass('page-inactive').addClass('page-active');
    },

    hide: function () {
      if (this.elt) {
        this.elt.removeClass('page-active').addClass('page-inactive');
      }
    }
  });
});
