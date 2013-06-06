/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
['score-display-helpers', 'dust-render', 'data-widget', 'i18n!../nls/strings'],
function (ScoreDisplayHelpers, render, DataWidget, translations) {
  'use strict';

  return function (elt, game, leaderboard, scoresToDisplay) {
    return DataWidget({
      scoresToDisplay: scoresToDisplay,

      elt: elt,

      templateName: 'leaderboard-mini',

      game: game,

      leaderboard: leaderboard,

      // this is a workaround so we can reuse the widget with
      // a score for the current game (in the game page and in the
      // finish page before a score is submitted); then set it to
      // false and re-render when the score is submitted but the
      // finish page is still visible
      includeCurrentGameInScores: true,

      render: function () {
        // returns a scores object with time and moves properties;
        // each contains an array of scores for this photo and difficulty
        var scores = leaderboard.getScoresForGame(
          this.game,
          this.scoresToDisplay,
          this.includeCurrentGameInScores
        );

        // pad out the data with dummy scores if there aren't enough
        // high scores
        var data = {
          scores: ScoreDisplayHelpers.pad(scores, this.scoresToDisplay),
          translations: translations
        };

        return render(this.templateName, data);
      }
    });
  };
});
