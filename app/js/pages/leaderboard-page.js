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
  'lodash',
  'score-display-helpers',
  'page',
  'photo-collection',
  'dust-render',
  'i18n!../../nls/strings',
  'api'
],
function ($, Q, _, ScoreDisplayHelpers, Page, photoCollection, render, translations, api) {
  'use strict';

  var leaderboard = api.leaderboard;

  var resolvePhotoUrls = function (scores) {
    var photoId;
    var photo;

    return _.map(scores, function (score) {
      photoId = score.photoId;
      photo = photoCollection.get(photoId);

      if (photo) {
        score.photoThumb = photo.thumb;
      }

      return score;
    });
  };

  return Page({
    templateName: 'leaderboard',

    scoresToDisplay: leaderboard.get('scoresToKeep'),

    init: function (elt) {
      var self = this;

      self.parentElt = $(elt);

      // when the leaderboard model updates, re-render the page
      // (NB this will happen in the background as the leaderboard
      // will change each time a score is submitted on the finish page)
      leaderboard.on('update', function () {
        self.update();
      });

      // this returns the promise
      return self.update();
    },

    activateFilter: function (filterBy) {
      var filterButtons = this.elt.find('[data-leaderboard-filter-control]');

      // disable all buttons
      filterButtons.each(function (btn) {
        var $btn = $(btn);

        if ($btn.attr('data-leaderboard-filter-control') === filterBy) {
          $btn.attr('data-current', 'true');
        }
        else {
          $btn.attr('data-current', 'false');
        }
      });

      // set the filter string for the leaderboard, which shows
      // the appropriate section of the leaderboard and hides the
      // other section via CSS
      this.elt.attr('data-leaderboard-filter', filterBy);
    },

    update: function () {
      var dfd = Q.defer();
      var scoresToDisplay = this.scoresToDisplay;

      var self = this;
      var scores = leaderboard.getTopScores(scoresToDisplay);
      var data = {
        translations: translations,
        sortedScores: []
      };

      _.each(scores, function (scoresForLevel, difficultyLevel) {
        var paddedScores = ScoreDisplayHelpers.pad(scoresForLevel, scoresToDisplay);

        // add the url for each photo to each score
        paddedScores.scoresByTime = resolvePhotoUrls(paddedScores.scoresByTime);
        paddedScores.scoresByMoves = resolvePhotoUrls(paddedScores.scoresByMoves);

        data.sortedScores.push({
          difficultyLevelName: translations[difficultyLevel],
          difficultyLevel: difficultyLevel,
          scoresForLevel: paddedScores
        });
      });

      render(this.templateName, data).then(
        function (html) {
          var existingPage = self.parentElt.find('[data-page=leaderboard]');
          if (existingPage) {
            self.parentElt.find('[data-leaderboard-filter-control]')
                          .removeListener('click');
            existingPage.remove();
          }

          self.parentElt.append(html);

          self.elt = self.parentElt.find('[data-page=leaderboard]');

          // enable the time/moves filter buttons
          self.parentElt.find('[data-leaderboard-filter-control]').on('click', function (e) {
            var filterBy = $(e.target).attr('data-leaderboard-filter-control');
            self.activateFilter(filterBy);
          });

          self.enableNavButtons();

          setTimeout(function () {
            dfd.resolve(self);
          }, 0);
        },
        dfd.reject
      );

      return dfd.promise;
    },

    show: function () {
      this.activateFilter('time');
      this.elt.removeClass('page-inactive').addClass('page-active');
    },

    hide: function () {
      if (this.elt) {
        this.elt.removeClass('page-active').addClass('page-inactive');
      }
    }
  });
});
