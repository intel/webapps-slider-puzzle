/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }
/*
 * singleton representing the leaderboard, persisted to localStorage;
 * each game played and saved to the leaderboard is represented by
 * an element in the data array associated with the leaderboard
 *
 * the scores property of the leaderboard is an object:
 *
 * {
 *   easy: {
 *     photo1: {
 *       time: [],
 *       moves: []
 *     },
 *     photo2: {
 *       ...
 *     }
 *   },
 *   medium: { ... },
 *   ...
 * }
 *
 * time contains scoresToKeep entries, with the fastest time
 * first; moves contains scoresToKeep entries, with the fewest
 * moves first; the ordering and length of the arrays are maintained
 * by the Leaderboard as new scores are entered.
 */
define(['stapes', 'lodash', 'score'], function (Stapes, _, Score) {
  'use strict';

  var sortAndPrune = function (values, orderBy, maxLength) {
    // sort all items in the collection by the property orderBy
    // ("lowest" value will be first)
    var sortedValues = _.sortBy(values, orderBy);

    // remove worst values
    sortedValues = sortedValues.slice(0, maxLength);

    return sortedValues;
  };

  var Leaderboard = Stapes.subclass({
    // localStorage key
    defaultKey: 'slider-puzzle-ng-leaderboard',

    // number of scores to keep for each list (also the number
    // returned for the full leaderboard list by default);
    // note that this number of scores is kept for each of
    // fewest moves and fastest times, for each difficulty level;
    // so for the default 3 difficulty levels, there will be a maximum
    // of (scoresToKeep moves + scoresToKeep times) * (3 difficulty
    // levels) scores kept (assuming the fastest games are disjunct
    // from the games needing the fewest number of moves)
    defaultScoresToKeep: 6,

    // useLocalStorage: false to only keep data in memory; default is true
    // (i.e. use localStorage to persist data)
    constructor: function (config) {
      config = config || {};

      var useLocalStorage = (config.useLocalStorage === false ? false : true);
      var scoresToKeep = config.scoresToKeep || this.defaultScoresToKeep;
      var difficultyLevels = config.difficultyLevels || [];
      var key = config.key || this.defaultKey;

      this.set('key', key);
      this.set('useLocalStorage', useLocalStorage);
      this.set('scoresToKeep', scoresToKeep);
      this.set('difficultyLevels', difficultyLevels);

      var rawScores = {};

      if (this.get('useLocalStorage')) {
        var json = localStorage.getItem(key);

        if (json) {
          rawScores = JSON.parse(json);
        }
      }

      for (var i = 0, len = difficultyLevels.length; i < len; i++) {
        if (!rawScores[difficultyLevels[i]]) {
          rawScores[difficultyLevels[i]] = {};
        }
      }

      this.scores = rawScores;
    },

    // this is a no-op if this.useLocalStorage is false
    save: function () {
      if (this.get('useLocalStorage')) {
        var jsonToSave = JSON.stringify(this.scores);
        localStorage.setItem(this.get('key'), jsonToSave);
      }

      this.emit('update');
    },

    addScore: function (score) {
      var maxPlayerLength = 3;
      var difficulty = score.difficulty;
      var photoId = score.photoId;
      var scoresToKeep = this.get('scoresToKeep');
      var difficultyLevels = this.get('difficultyLevels');
      var validDifficulty = _.include(difficultyLevels, difficulty);
      var validPlayer = (score.who.length <= maxPlayerLength);

      if (!validDifficulty || !this.scores[difficulty]) {
        throw new Error('cannot add score for difficulty level ' + difficulty);
      }

      if (!validPlayer) {
        throw new Error('player name must be ' + maxPlayerLength +
                        ' characters or fewer in length');
      }

      var listsForPhoto = this.scores[difficulty][photoId];

      // create time and moves lists for this photoId if it doesn't exist
      if (!listsForPhoto) {
        listsForPhoto = {
          time: [score],
          moves: [score]
        };

        this.scores[difficulty][photoId] = listsForPhoto;
      }
      // lists exist, so insert the new score if appropriate
      else {
        listsForPhoto.moves.push(score);
        listsForPhoto.time.push(score);

        // sort, keep the fastest scores
        listsForPhoto.time = sortAndPrune(
          listsForPhoto.time,
          'time',
          scoresToKeep
        );

        // sort, keep the scores with fewest moves
        listsForPhoto.moves = sortAndPrune(
          listsForPhoto.moves,
          'moves',
          scoresToKeep
        );
      }

      this.save();
    },

    // return the scores data structure, with the scores for
    // each difficulty/orderBy correctly ordered
    getScores: function () {
      return this.scores;
    },

    // get the top numberScores scores for both time and moves,
    // for each difficulty level;
    // returns an object {<difficulty>: {time: [...], moves: [...]}, ...}
    getTopScores: function (numberScores) {
      var scores = {};

      _.each(this.scores, function (scoresByPhoto, difficulty) {
        var scoresByTime = [];
        var scoresByMoves = [];

        _.each(_.values(scoresByPhoto), function (scoresByTimeAndMoves) {
          scoresByTime = scoresByTime.concat(scoresByTimeAndMoves.time);
          scoresByMoves = scoresByMoves.concat(scoresByTimeAndMoves.moves);
        });

        scoresByTime = sortAndPrune(scoresByTime, 'time', numberScores);
        scoresByMoves = sortAndPrune(scoresByMoves, 'moves', numberScores);

        scores[difficulty] = {time: scoresByTime, moves: scoresByMoves};
      });

      return scores;
    },

    // get scores for a specific difficulty + photoId pair,
    // or empty arrays for each if they are not set; if
    // includeCurrentGameInScores is true, a score for the current game
    // is added; this has a property forCurrentGame:true to mark
    // it as being an unrecorded score, which also allows it to be
    // rendered with a highlight in mini leaderboard widgets
    getScoresForGame: function (game, numberScores, includeCurrentGameInScores) {
      var difficulty = game.get('difficulty');
      var photoId = game.get('photo').id;

      var moves = game.get('moves');
      var time = game.get('time');

      var scores = this.getFilteredScores(difficulty, photoId);

      if (includeCurrentGameInScores) {
        var gameScore = Score({
          player: '?',
          photoId: photoId,
          difficulty: difficulty,
          moves: moves,
          time: time
        });

        gameScore.forCurrentGame = true;

        scores.time.push(gameScore);
        scores.moves.push(gameScore);

        // prune the scores
        scores.time = sortAndPrune(scores.time, 'time', numberScores);
        scores.moves = sortAndPrune(scores.moves, 'moves', numberScores);
      }

      return scores;
    },

    getFilteredScores: function (difficulty, photoId) {
      var scores;

      if (this.scores[difficulty][photoId]) {
        scores = {
          time: _.clone(this.scores[difficulty][photoId].time),
          moves: _.clone(this.scores[difficulty][photoId].moves)
        };
      }
      else {
        scores = {time: [], moves: []};
      }

      return scores;
    },

    isQualifyingScore: function (score) {
      var difficulty = score.difficulty;
      var photoId = score.photoId;
      var time = score.time;
      var moves = score.moves;
      var scoresToKeep = this.get('scoresToKeep');

      var existingScores = this.getFilteredScores(difficulty, photoId);

      var timeScoresHasSpace = existingScores.time.length < scoresToKeep;

      if (timeScoresHasSpace) {
        return true;
      }

      var movesScoresHasSpace = existingScores.moves.length < scoresToKeep;
      if (movesScoresHasSpace) {
        return true;
      }

      for (var i = 0, lenT = existingScores.time.length; i < lenT; i++) {
        if (existingScores.time[i].time >= time) {
          return true;
        }
      }

      for (var j = 0, lenM = existingScores.moves.length; j < lenM; j++) {
        if (existingScores.moves[j].moves >= moves) {
          return true;
        }
      }

      return false;
    }
  });

  return function (config) {
    return new Leaderboard(config);
  };
});
