/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['rye', 'Q', 'dust-render', 'page', 'photo-collection', 'i18n!../../nls/strings'],
function ($, Q, render, Page, photoCollection, translations) {
  'use strict';

  return Page({
    init: function (elt) {
      var dfd = Q.defer();
      var self = this;

      this.templateName = 'photopicker';
      this.data = {
        photos: photoCollection.getAllAsArray(),
        translations: translations
      };

      this.parentElt = $(elt);

      dfd.resolve(self);

      return dfd.promise;
    },

    showElement: function () {
      var elt = this.elt;

      elt.removeClass('page-inactive').addClass('page-active');

      // reset the scroll so the top row of the widget is visible
      setTimeout(function () {
        elt.find('[data-widget="gallery"]').get(0).scrollTop = 0;
      }, 0);
    },

    show: function () {
      if (this.elt) {
        this.showElement();
      }
      else {
        var self = this;

        render(this.templateName, this.data).then(function (html) {
          self.parentElt.append(html);
          self.elt = self.parentElt.find('[data-page=photopicker]');
          self.enableNavButtons();
          self.showElement();
        });
      }
    },

    hide: function () {
      if (this.elt) {
        this.elt.removeClass('page-active').addClass('page-inactive');
      }
    }
  });
});
