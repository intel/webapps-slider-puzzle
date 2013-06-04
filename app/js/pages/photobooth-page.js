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
        self.enableNavButtons();

        var videoElt = self.elt.find('video').get(0);
        var camera = new Camera(videoElt);

        camera.init()
        .then(
          function () {
            setTimeout(function () {
              // HACK on Tizen, rotate the video element
              if (typeof tizen !== 'undefined') {
                $(videoElt).addClass('photobooth-rotate');
              }

              dfd.resolve(self);
            }, 0);
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
      this.elt.removeClass('page-inactive').addClass('page-active');
    },

    hide: function () {
      if (this.elt) {
        this.elt.removeClass('page-active').addClass('page-inactive');
      }
    }
  });
});
