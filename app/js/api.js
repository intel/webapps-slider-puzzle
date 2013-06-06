/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

// leaderboard and game singletons used throughout the app
//
// as the user changes photo or starts a game, the game object's
// properties are mutated; so there is only a single Game
// instance active at any one time
define(
['lodash', 'game', 'leaderboard', 'photo-collection', 'sound-board'],
function (_, Game, Leaderboard, photoCollection, SoundBoard) {
  'use strict';

  var difficulties = {
    easy: {
      tilesPerSide: 2,
      shuffles: 9
    },
    hard: {
      tilesPerSide: 3,
      shuffles: 17
    },
    brutal: {
      tilesPerSide: 4,
      shuffles: 33
    }
  };

  var difficultyLevels = _.keys(difficulties);
  var defaultDifficulty = difficultyLevels[0];

  // get the first photo in the collection
  var defaultPhoto = photoCollection.get(function () { return true; });

  var game = Game({
    startingDifficulty: defaultDifficulty,
    startingPhoto: defaultPhoto,
    difficulties: difficulties,
    photoCollection: photoCollection
  });

  var leaderboard = Leaderboard({
    key: 'slider-puzzle-ng-leaderboard',
    useLocalStorage: true,
    scoresToKeep: 6,
    difficultyLevels: difficultyLevels
  });

  var soundBoard = new SoundBoard({
    win: 'audio/win.ogg',
    shuffle: 'audio/shuffle.ogg'
  });

  return {
    game: game,
    leaderboard: leaderboard,
    soundBoard: soundBoard
  };
});
