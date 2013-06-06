/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['rye', 'Q', 'lodash', 'dust-render', 'page', 'photo-collection', 'i18n!../../nls/strings'],
function ($, Q, _, render, Page, photoCollection, translations) {
  'use strict';

  return Page({
    init: function (elt) {
      var dfd = Q.defer();

      this.templateName = 'photopopup';
      this.parentElt = $(elt);

      dfd.resolve(this);

      return dfd.promise;
    },

    showElement: function () {
      this.elt.removeClass('page-inactive').addClass('page-active');
      this.enableNavButtons();
    },

    show: function (params) {
      var self = this;

      var photoId = params.photoId;
      var photo = photoCollection.get(photoId);
      var data = {
        photo: photo,
        translations: translations
      };

      render(this.templateName, data).then(function (html) {
        var existingPage = self.parentElt.find('[data-page=photopopup]');
        var image;

        if (existingPage) {
          image = self.parentElt.find('.photopopup-image');
          image.removeListener('load');
          existingPage.remove();
        }

        self.parentElt.append(html);
        self.elt = self.parentElt.find('[data-page=photopopup]');

        image = self.parentElt.find('.photopopup-image');
        image.on('load', _.bind(self.showElement, self));
      });
    },

    hide: function () {
      if (this.elt) {
        this.elt.removeClass('page-active').addClass('page-inactive');
      }
    }
  });
});
