/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['stapes', 'score', 'dust-render', 'data-widget', 'i18n!../nls/strings'],
function (Stapes, Score, render, DataWidget, translations) {
  'use strict';

  return function (elt, game, leaderboard) {
    var widget = DataWidget({
      elt: elt,

      templateName: 'score-save',

      game: game,

      leaderboard: leaderboard,

      score: null,

      refresh: function () {
        // no need to refresh if score is not qualifying
        if (!leaderboard.isQualifyingScore(this.score)) {
          return;
        }

        var self = this;

        // save button
        self.saveButton = self.elt.find('#save-score');

        // name text entry
        self.nameEntry = self.elt.find('#name-entry');

        // give focus to name entry when label is clicked (to make
        // it easier to press in the input box on small screens)
        self.elt.find('label').on('click', function () {
          self.nameEntry.trigger('focus');
        });

        // when save button clicked, save to leaderboard, set text to
        // "saved" and disable button and nameEntry
        self.saveButton.on('click', function () {
          self.conditionallyEmitSave();
        });

        // pressing return when nameEntry is in focus causes save
        // if save button is enabled
        self.nameEntry.on('keypress', function (e) {
          if (e.charCode === 13) {
            self.conditionallyEmitSave();
          }
        });

        // enable save button when there is some text in the text entry;
        // NB this is about the only place in the app where a translation
        // is applied outside a template
        self.nameEntry.on('keyup', function () {
          var nameEntryEnabled = !self.nameEntry.get(0).hasAttribute('disabled');

          if (self.nameEntry.val() !== '' && nameEntryEnabled) {
            self.saveButton.get(0).removeAttribute('disabled');
          }
          else {
            self.saveButton.attr('disabled', 'disabled');
          }
        });

        self.saveButton.attr('disabled', 'disabled')
                       .val(translations.save);
        self.nameEntry.get(0).removeAttribute('disabled');
        self.nameEntry.val('');
      },

      conditionallyEmitSave: function () {
        var savePossible = (this.saveButton.attr('disabled') !== 'disabled' &&
                            leaderboard.isQualifyingScore(this.score));

        if (!savePossible) {
          return;
        }

        this.score.who = this.nameEntry.val();
        this.emit('save', this.score);

        this.saveButton.attr('disabled', 'disabled')
                       .val(translations.saved);

        this.nameEntry.attr('disabled', 'disabled');
      },

      resetScore: function () {
        this.score = Score({
          player: '',
          photoId: game.get('photo').id,
          difficulty: game.get('difficulty'),
          moves: game.get('moves'),
          time: game.get('time')
        });
      },

      render: function () {
        var data = {
          translations: translations
        };

        this.resetScore();

        if (leaderboard.isQualifyingScore(this.score)) {
          data.qualifyingScore = true;
        }

        return render(this.templateName, data);
      }
    });

    Stapes.mixinEvents(widget);

    return widget;
  };
});
