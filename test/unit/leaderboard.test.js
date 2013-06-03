/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

// node modules
require('chai').should();

// replace node require with AMD require
require = require('../amd-require');

// AMD modules
var Leaderboard = require('leaderboard');
var Score = require('score');
var _ = require('lodash');

// stub for localStorage
var LocalStorageStub = function () {
  this.data = {};
  this.stubScores = {};

  this.getItem = function (key) {
    return this.data[key];
  };

  this.setItem = function (key, newData) {
    this.data[key] = newData;
  };

  // not part of the localStorage API, but here for my convenience
  this.reset = function () {
    this.data = _.clone(this.stubScores);
  };
};

global.localStorage = new LocalStorageStub();

// suite
describe('Leaderboard', function () {
  // fixtures
  var difficultyLevels = ['easy', 'hard', 'brutal'];

  var score1 = Score({
    difficulty: 'easy',
    dateRecorded: new Date('2013-05-03'),
    player: 'es',
    photoId: '1111',
    moves: 6,
    time: 10000
  });

  var score2 = Score({
    difficulty: 'easy',
    dateRecorded: new Date('2013-05-07'),
    player: 'ks',
    photoId: '1111',
    moves: 4,
    time: 20000
  });

  var score3 = Score({
    difficulty: 'hard',
    dateRecorded: new Date('2013-05-08'),
    player: 'hh',
    photoId: '3333',
    moves: 10,
    time: 15000
  });

  var score4 = Score({
    difficulty: 'hard',
    dateRecorded: new Date('2013-05-09'),
    player: 'h2',
    photoId: '4444',
    moves: 5,
    time: 25000
  });

  var score5 = Score({
    difficulty: 'brutal',
    dateRecorded: new Date('2013-05-10'),
    player: 'bb',
    photoId: '5555',
    moves: 12,
    time: 18000
  });

  var score6 = Score({
    difficulty: 'brutal',
    dateRecorded: new Date('2013-05-10'),
    player: 'bb',
    photoId: '6666',
    moves: 11,
    time: 28000
  });

  beforeEach(function () {
    localStorage.reset();
  });

  // specs
  it('should use configuration passed to constructor', function () {
    var leaderboard = Leaderboard({
      useLocalStorage: false,
      scoresToKeep: 8
    });

    leaderboard.get('useLocalStorage').should.be.false;
    leaderboard.get('scoresToKeep').should.equal(8);
  });

  it('should use defaults if configuration missing', function () {
    var leaderboard = Leaderboard();
    leaderboard.get('useLocalStorage').should.be.true;
    leaderboard.get('scoresToKeep').should.equal(6);
  });

  it('should save scores by difficulty level and photo', function () {
    // leaderboard with score lists for 3 difficulty levels
    var leaderboard = Leaderboard({
      difficultyLevels: difficultyLevels,
      scoresToKeep: 4
    });

    leaderboard.addScore(score1);
    leaderboard.addScore(score2);

    var scores = leaderboard.getScores();

    // score should be entered into both the time and moves sections
    // of the leaderboard for the 'easy' difficulty level;
    // for time, score1 should be first; for moves, score2 should be first
    scores['easy']['1111'].time.should.deep.equal([score1, score2]);
    scores['easy']['1111'].moves.should.deep.equal([score2, score1]);

    // score should not be on the lists for the other difficulty levels
    scores['hard'].should.deep.equal({});
    scores['brutal'].should.deep.equal({});
  });

  it('should save scores to localStorage', function () {
    // leaderboard with lists for 3 difficulty levels
    var leaderboard = Leaderboard({
      key: 'testing',
      difficultyLevels: difficultyLevels,
      scoresToKeep: 1
    });

    leaderboard.addScore(score1);
    leaderboard.addScore(score2);

    // a different leaderboard instance with the same key;
    // should load from the same part of localStorage
    var leaderboard2 = Leaderboard({
      key: 'testing',
      difficultyLevels: difficultyLevels,
      scoresToKeep: 1
    });

    var scores = leaderboard2.getScores();
    scores.easy['1111'].time.length.should.equal(1);
    scores.easy['1111'].moves.length.should.equal(1);
    scores.should.deep.equal(leaderboard.getScores());
  });

  it('should only save the number of scores specified', function () {
    // leaderboard with lists for 3 difficulty levels
    var leaderboard = Leaderboard({
      difficultyLevels: difficultyLevels,
      scoresToKeep: 1
    });

    leaderboard.addScore(score1);
    leaderboard.addScore(score2);

    var scores = leaderboard.getScores();

    // score should be entered into both the time and moves sections
    // of the leaderboard for the 'easy' difficulty level;
    // for time, score1 should be first; for moves, score2 should be first
    scores['easy']['1111'].time.should.deep.equal([score1]);
    scores['easy']['1111'].moves.should.deep.equal([score2]);
  });

  it('should provide top scores across all photos per difficulty level', function () {
    var leaderboard = Leaderboard({
      difficultyLevels: difficultyLevels,
      scoresToKeep: 2
    });

    leaderboard.addScore(score1);
    leaderboard.addScore(score2);
    leaderboard.addScore(score3);
    leaderboard.addScore(score4);
    leaderboard.addScore(score5);
    leaderboard.addScore(score6);

    var scores = leaderboard.getTopScores(2);

    var easyScores = scores[difficultyLevels[0]];
    var hardScores = scores[difficultyLevels[1]];
    var brutalScores = scores[difficultyLevels[2]];

    easyScores.time.should.deep.equal([score1, score2]);
    easyScores.moves.should.deep.equal([score2, score1]);

    // the scores within hard and brutal have different photos,
    // but should still be returned in a single array
    hardScores.time.should.deep.equal([score3, score4]);
    hardScores.moves.should.deep.equal([score4, score3]);

    brutalScores.time.should.deep.equal([score5, score6]);
    brutalScores.moves.should.deep.equal([score6, score5]);
  });

  it('should be able to determine when a score will qualify for the leaderboard', function () {
    var leaderboard = Leaderboard({
      difficultyLevels: difficultyLevels,
      scoresToKeep: 2
    });

    leaderboard.addScore(score1);
    leaderboard.addScore(score2);

    var scores = leaderboard.getFilteredScores('easy', '1111');
    scores.should.deep.equal({
      time: [score1, score2],
      moves: [score2, score1]
    });

    // NB a score with the same number of moves trumps an existing
    // score; this has the same moves as score1
    var qualifiesOnMoves = Score({
      difficulty: 'easy',
      dateRecorded: new Date('2013-05-03'),
      player: 'es',
      photoId: '1111',
      moves: 6,
      time: 30000
    });

    leaderboard.isQualifyingScore(qualifiesOnMoves).should.be.true;

    // NB a score with the same time trumps an existing score;
    // this has the same time as score2
    var qualifiesOnTime = Score({
      difficulty: 'easy',
      dateRecorded: new Date('2013-05-03'),
      player: 'es',
      photoId: '1111',
      moves: 20,
      time: 20000
    });

    leaderboard.isQualifyingScore(qualifiesOnTime).should.be.true;
  });

  it('should be able to determine when a score will NOT qualify for the leaderboard', function () {
    var leaderboard = Leaderboard({
      difficultyLevels: difficultyLevels,
      scoresToKeep: 2
    });

    leaderboard.addScore(score1);
    leaderboard.addScore(score2);

    var scores = leaderboard.getFilteredScores('easy', '1111');
    scores.should.deep.equal({
      time: [score1, score2],
      moves: [score2, score1]
    });

    var tooSlow = Score({
      difficulty: 'easy',
      dateRecorded: new Date('2013-05-03'),
      player: 'es',
      photoId: '1111',
      moves: 7,
      time: 30000
    });

    leaderboard.isQualifyingScore(tooSlow).should.be.false;
  });

  it('lets any score qualify if leaderboard is empty', function () {
    var leaderboard = Leaderboard({
      difficultyLevels: difficultyLevels,
      scoresToKeep: 2
    });

    var newScore = Score({
      difficulty: 'easy',
      dateRecorded: new Date('2013-05-03'),
      player: 'es',
      photoId: '1111',
      moves: 7,
      time: 30000
    });

    leaderboard.isQualifyingScore(newScore).should.be.true;
  });

  it('lets any score qualify if leaderboard for difficulty/photo is not full', function () {
    var leaderboard = Leaderboard({
      difficultyLevels: difficultyLevels,
      scoresToKeep: 2
    });

    leaderboard.addScore(score1);

    var newScore = Score({
      difficulty: 'easy',
      dateRecorded: new Date('2013-05-03'),
      player: 'es',
      photoId: '1111',
      moves: 7,
      time: 30000
    });

    leaderboard.isQualifyingScore(newScore).should.be.true;
  });
})
