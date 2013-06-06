/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['Q', 'rye', 'page', 'dust-render', 'i18n!../../nls/strings'],
function (Q, Rye, Page, render, translations) {
  'use strict';

  return Page({
    elt: null,

    templateName: 'home',

    init: function (eltIn) {
      var dfd = Q.defer();
      var self = this;

      this.elt = Rye(eltIn);

      render(this.templateName, {translations: translations}).then(
        function (html) {
          self.elt.find('.home-btn-panel').append(html);

          setTimeout(function () {
            self.enableNavButtons();
            dfd.resolve(self);
          }, 0);
        }
      );

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
