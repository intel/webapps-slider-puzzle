/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }
// representation of a single score for a single game
define(function () {
  'use strict';

  // when: when the score was logged; stored as a string and converted
  // back to a date when required
  // who: initials of the person who logged the score
  // photoId: ID of the photo used for the game
  // difficulty: difficulty level ('easy', 'medium', brutal)
  // moves: number of moves to complete the puzzle
  // time: time in ms to complete the puzzle
  var Score = function (when, who, photoId, difficulty, moves, time) {
    this.when = JSON.stringify(when);
    this.who = who;
    this.photoId = photoId;
    this.difficulty = difficulty;
    this.moves = moves;
    this.time = time;
  };

  return function (config) {
    return new Score(
      config.dateRecorded || new Date(),
      config.player,
      config.photoId,
      config.difficulty,
      config.moves,
      config.time
    );
  };
});
