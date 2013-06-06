/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['lodash', 'rye', 'tile-widget', 'board-widget', 'dust-render', 'data-widget', 'i18n!../nls/strings'],
function (_, $, TileWidget, BoardWidget, render, DataWidget, translations) {
  'use strict';

  // the UI for the puzzle image
  return function (elt, game) {
    var widget = DataWidget({
      elt: elt,

      templateName: 'puzzle-widget',

      game: game,

      board: new BoardWidget(),

      // setup TileWidgets, then BoardWidget
      refresh: function () {
        var parentElt = $(this.elt);

        var gameTiles = this.game.get('tiles');

        // associate each game tile with a DOM element
        var selector;
        for (var i = 0; i < gameTiles.length; i += 1) {
          var gameTile = gameTiles[i];

          selector = '[data-column="' + gameTile.column +
                     '"][data-row="' + gameTile.row + '"]';

          var tileElt = parentElt.find(selector).get(0);

          gameTile.tile = new TileWidget(tileElt);
        }

        var frame = parentElt.find('.puzzle-frame').get(0);
        var tileWidth = frame.offsetWidth / this.game.get('columns');
        var tileHeight = frame.offsetHeight / this.game.get('rows');

        this.board.reset(game, tileWidth, tileHeight);
      },

      // disable all event handlers on tiles, show overlay with
      // pause message
      pause: function () {
        // TODO move to BoardWidget: disableTiles(this.elt.find('.puzzle-tile'));
        this.elt.find('.puzzle-tiled').attr('data-puzzle-frame-state', 'hidden');
        this.elt.find('.puzzle-solved').attr('data-puzzle-frame-state', 'visible');
        this.elt.find('.puzzle-pause-overlay').attr('data-overlay-state', 'visible');
      },

      // enable all event handlers on tiles, remove overlays
      start: function () {
        // TODO move to BoardWidget: enableTiles(this.elt.find('.puzzle-tile'));
        this.elt.find('.puzzle-tiled').attr('data-puzzle-frame-state', 'visible');
        this.elt.find('.puzzle-solved').attr('data-puzzle-frame-state', 'hidden');
        this.elt.find('.puzzle-pause-overlay').attr('data-overlay-state', 'hidden');
      },

      render: function () {
        var data = {
          rows: this.game.get('rows'),
          columns: this.game.get('columns'),
          photoUrl: this.game.get('photo').full,
          tiles: this.game.get('tiles'),
          translations: translations
        };

        return render(this.templateName, data);
      }
    });

    return widget;
  };
});
