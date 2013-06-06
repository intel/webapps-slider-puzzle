/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['lodash'], function (_) {
  'use strict';

  // insert some empty scores if there aren't enough in a list;
  // scores is a structure
  //   {time: [...], moves: [...]}
  // where each array contains Score objects
  var pad = function (scores, scoresToDisplay) {
    var scoresByTime = [];
    var scoresByMoves = [];

    for (var i = 1; i <= scoresToDisplay; i++) {
      var scoreByTime = {position: i};
      var scoreByMoves = {position: i};

      if (scores.time[i - 1]) {
        _.extend(scoreByTime, scores.time[i - 1]);
      }

      if (scores.moves[i - 1]) {
        _.extend(scoreByMoves, scores.moves[i - 1]);
      }

      scoresByTime.push(scoreByTime);
      scoresByMoves.push(scoreByMoves);
    }

    return {
      scoresByTime: scoresByTime,
      scoresByMoves: scoresByMoves
    };
  };

  return {
    pad: pad
  };
});
