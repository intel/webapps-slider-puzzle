/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['Q', 'rye', 'dust-render', 'page'], function (Q, $, render, Page) {
  'use strict';

  return Page({
    elt: null,

    templateName: 'help',

    init: function (eltIn) {
      var dfd = Q.defer();
      var self = this;

      this.parentElt = $(eltIn);

      render(this.templateName).then(function (html) {
        self.parentElt.append(html);
        self.elt = self.parentElt.find('[data-page=help]');

        self.enableNavButtons();

        setTimeout(function () {
          dfd.resolve(self);
        }, 0);
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
