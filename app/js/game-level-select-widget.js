/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['lodash', 'rye', 'stapes', 'dust-render', 'data-widget', 'i18n!../nls/strings'],
function (_, $, Stapes, render, DataWidget, translations) {
  'use strict';

  return function (elt, game) {
    var widget = DataWidget({
      elt: elt,

      templateName: 'game-level-select',

      game: game,

      // this is to remove the need to redraw the widget every time
      // the game level changes; it is called when any of the buttons
      // is clicked
      highlightLevel: function (levelToHighlight) {
        var buttons = this.elt.find('.level-select-btn');

        buttons.each(function (btn) {
          btn = $(btn);

          if (btn.attr('data-level') === levelToHighlight) {
            btn.attr('data-current', 'true');
          }
          else {
            btn.attr('data-current', 'false');
          }
        });
      },

      refresh: function () {
        var self = this;

        self.elt.find('.level-select-btn')
                .removeListener('click')
                .on('click', function (e) {
                  var btn = $(e.target);
                  var isCurrent = (btn.attr('data-current') === 'true');

                  if (!isCurrent) {
                    var newLevel = btn.attr('data-level');
                    btn.attr('data-current', 'true');
                    self.highlightLevel(newLevel);
                    self.emit('select', newLevel);
                  }
                });
      },

      render: function () {
        var gameDifficulty = game.get('difficulty');

        var difficulties = _.map(game.difficulties, function (value, level) {
          var levelObj = {
            level: level,
            name: translations[level],
            current: 'false'
          };

          if (level === gameDifficulty) {
            levelObj.current = 'true';
          }

          return levelObj;
        });

        return render(this.templateName, {
          difficulties: difficulties,
          translations: translations
        });
      }
    });

    Stapes.mixinEvents(widget);

    return widget;
  };
});
