/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['dust-render', 'data-widget', 'i18n!../nls/strings'],
function (render, DataWidget, translations) {
  'use strict';

  // showPhotoCredit: true or false; if true, a photo credit
  // will be included with the game info (this is set to false for
  // the game info widget on the finish page, and true on the
  // game page)
  // TODO split photo credit into a separate widget?
  return function (elt, game, showPhotoCredit) {
    var widget = DataWidget({
      elt: elt,

      showPhotoCredit: showPhotoCredit,

      templateName: 'game-info',

      game: game,

      render: function () {
        var data = {
          game: this.game.getAll(),
          translations: translations
        };

        if (this.showPhotoCredit) {
          data.photoCredit = game.get('photo').creator;
        }

        return render(this.templateName, data);
      }
    });

    return widget;
  };
});
