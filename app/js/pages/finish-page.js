/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
[
  'rye',
  'Q',
  'dust-render',
  'page',
  'leaderboard-mini-widget',
  'game-info-widget',
  'score-save-widget',
  'i18n!../../nls/strings',
  'api'
],
function (
  $,
  Q,
  render,
  Page,
  LeaderboardMiniWidget,
  GameInfoWidget,
  ScoreSaveWidget,
  translations,
  api
) {
  'use strict';

  var parentElt = null;
  var game = api.game;
  var leaderboard = api.leaderboard;
  var soundBoard = api.soundBoard;

  return Page({
    templateName: 'finish',

    game: game,

    init: function (elt) {
      var dfd = Q.defer();
      var self = this;

      soundBoard.load('win');

      parentElt = $(elt);

      var data = {
        game: game.getAll(),
        translations: translations
      };

      render(this.templateName, data).then(function (html) {
        parentElt.append(html);
        self.elt = parentElt.find('[data-page=finish]');

        game.on('change:photo', self.setImage.bind(self));

        // mini leaderboard, right-hand side of ribbon
        var leaderboardElt = self.elt.find('[data-widget=leaderboard-mini]');
        var scoresToDisplay = 3;

        self.leaderboardMini = LeaderboardMiniWidget(
          leaderboardElt,
          game,
          leaderboard,
          scoresToDisplay
        );
        self.leaderboardMini.update();

        self.leaderboardMini.watch(leaderboard);
        self.leaderboardMini.watch(game);

        // game info panel
        var gameInfoElt = self.elt.find('[data-widget=game-info]');
        self.gameInfo = GameInfoWidget(gameInfoElt, game);
        self.gameInfo.update();
        self.gameInfo.watch(game);

        // score entry form
        var scoreSaveElt = self.elt.find('[data-widget=score-save]');
        self.scoreSave = ScoreSaveWidget(scoreSaveElt, game, leaderboard);
        self.scoreSave.update();
        self.scoreSave.watch(game, ['update:moves', 'update:time']);

        // bind to save events on the scoreSave widget
        self.scoreSave.on('save', function (score) {
          self.saveScore(score);
        });

        // enable navigation buttons
        self.enableNavButtons();

        // done
        setTimeout(function () {
          dfd.resolve(self);
        }, 0);
      });

      return dfd.promise;
    },

    saveScore: function (score) {
      this.leaderboardMini.includeCurrentGameInScores = false;
      leaderboard.addScore(score);
      this.leaderboardMini.includeCurrentGameInScores = true;
    },

    setImage: function () {
      var photoUri = 'url(' + this.game.get('photo').full + ')';
      this.elt.find('.puzzle-solved').css('background-image', photoUri);
    },

    show: function () {
      if (this.elt) {
        this.elt.removeClass('page-inactive').addClass('page-active');
        soundBoard.play('win');
      }
    },

    hide: function () {
      if (this.elt) {
        this.elt.removeClass('page-active').addClass('page-inactive');
      }
    }
  });
});
