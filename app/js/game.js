/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/*
 * singleton representing the current active game;
 * this is just reset if the game difficulty or photo
 * changes; it can also be manually reset from the UI
 */

/* allow nesting 3 levels deep until I come up
 * with something better
 */
/* jshint -W073 */
define(['stapes', 'lodash'], function (Stapes, _) {
  'use strict';

  var Tile = function (column, row) {
    // where the tile _is_ in the current game
    this.row = row;
    this.column = column;

    // where the tile _should_ be in the puzzle
    this.targetColumn = column;
    this.targetRow = row;
  };

  // time starts at 0 and is incremented each time the game is paused
  // when the game is started, we set a timestamp lastStarted
  // to the current time; when the game is paused, take the difference
  // now - lastStarted and add it to time; when the game starts again,
  // lastStarted gets reset again; when the game finishes, that also
  // acts the same way as a pause, but we don't allow the game to
  // restart unless it is reset (which resets time and then starts the
  // game again, which in turn resets lastStarted)
  var Game = Stapes.subclass({
    constructor: function (config) {
      var self = this;

      // TODO check config
      this.difficulties = config.difficulties;
      this.photoCollection = config.photoCollection;
      var startingDifficulty = config.startingDifficulty;
      var startingPhoto = config.startingPhoto;

      // setting difficulty sets the rows and columns for the puzzle
      // as well as the number of shuffles; it also pre-computes
      // the x,y coordinates of adjacent tiles for each tile (which
      // is the same regardless of the photo)
      this.on('change:difficulty', function (difficultyValue) {
        var tilesPerSide = this.difficulties[difficultyValue].tilesPerSide;
        self.set('rows', tilesPerSide);
        self.set('columns', tilesPerSide);

        var shuffles = this.difficulties[difficultyValue].shuffles;
        self.set('shuffles', shuffles);
      });

      this.setDifficulty(startingDifficulty);
      this.set('photo', startingPhoto);

      this.reset();
    },

    // creates the tiles for a particular difficulty level,
    // setting them in their starting positions and marking one random
    // tile as empty
    resetTiles: function () {
      var tiles = [];
      var rows = this.get('rows') || 1;
      var columns = this.get('columns') || 1;

      for (var row = 1; row <= rows; row++) {
        for (var column = 1; column <= columns; column++) {
          tiles.push(new Tile(column, row));
        }
      }

      // randomly delete a tile
      var randomTileIndex = Math.floor(Math.random() * tiles.length);

      var deletedTile = tiles[randomTileIndex];
      this.set('emptyPosition', {
        row: deletedTile.row,
        column: deletedTile.column
      });

      tiles = tiles.slice(0, randomTileIndex)
                   .concat(tiles.slice(randomTileIndex + 1));

      this.set('tiles', tiles);
    },

    getAdjacentTiles: function (column, row) {
      var tiles = this.get('tiles');

      var adjacentTiles = [];
      var tile;
      var col;
      var rw;
      var sameColumn;
      var sameRow;
      var adjacentRow;
      var adjacentColumn;

      for (var i = 0; i < tiles.length; i += 1) {
        tile = tiles[i];

        col = tile.column;
        rw = tile.row;

        sameColumn = (col === column);
        sameRow = (rw === row);
        adjacentRow = (rw === row - 1 || rw === row + 1);
        adjacentColumn = (col === column - 1 || col === column + 1);

        if ((sameColumn && adjacentRow) || (sameRow && adjacentColumn)) {
          adjacentTiles.push(tile);
        }
      }

      return adjacentTiles;
    },

    shuffle: function () {
      var shuffles = this.get('shuffles');
      var emptyPosition = this.get('emptyPosition');
      var emptyRow;
      var emptyColumn;

      var lastMoved = null;
      var adjacentTiles;
      var randomIndex;
      var tileToMove;

      var rejectLastMoved = function (tile) {
        return tile === lastMoved;
      };

      for (var i = 0; i < shuffles; i += 1) {
        emptyRow = emptyPosition.row;
        emptyColumn = emptyPosition.column;

        // get all tiles adjacent to the empty position
        adjacentTiles = this.getAdjacentTiles(emptyColumn, emptyRow);

        // filter out the lastMoved tile
        adjacentTiles = _.reject(adjacentTiles, rejectLastMoved);

        // select a tile to move
        randomIndex = Math.floor(adjacentTiles.length * Math.random());
        tileToMove = adjacentTiles[randomIndex];

        // reset the empty position
        emptyPosition.row = tileToMove.row;
        emptyPosition.column = tileToMove.column;

        // swap its position with the empty position
        tileToMove.row = emptyRow;
        tileToMove.column = emptyColumn;

        lastMoved = tileToMove;
      }

      this.set('emptyPosition', emptyPosition);
    },

    // check the row and column values of each tile against its y and x
    // values respectively; if they match for every tile, the puzzle
    // is done
    checkCompleted: function () {
      // you can only complete the puzzle once
      if (this.get('completed')) {
        return false;
      }

      var allMatch = true;

      var tiles = this.get('tiles');

      for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].targetColumn !== tiles[i].column ||
            tiles[i].targetRow !== tiles[i].row) {
          allMatch = false;
          break;
        }
      }

      this.set('completed', allMatch);

      if (allMatch) {
        this.emit('completed');
      }

      return allMatch;
    },

    reset: function () {
      this.resetTiles();
      this.shuffle();
      this.set('time', 0);
      this.set('moves', 0);
      this.set('completed', false);
      this.set('player', '');
      this.start();
      this.emit('reset');
    },

    setDifficulty: function (difficulty) {
      if (!_.include(_.keys(this.difficulties), difficulty)) {
        throw new Error('cannot set game difficulty to "' + difficulty + '"');
      }

      this.set('difficulty', difficulty);
    },

    // NB this only updates the photo if photoId is different from the ID
    // of the current photo
    setPhotoById: function (photoId) {
      var photo = this.photoCollection.get(photoId);

      if (!photo) {
        throw new Error('cannot set photo for game by ID ' + photoId);
      }

      if (this.get('photo').id !== photoId) {
        this.set('photo', photo);
      }
    },

    getPhotoById: function (photoId) {
      return this.photoCollection.get(photoId);
    },

    incrementMoves: function () {
      this.set('moves', this.get('moves') + 1);
    },

    pause: function () {
      var lastStarted = this.get('lastStarted');

      if (lastStarted) {
        var elapsed = (new Date()).getTime() - lastStarted;
        this.set('time', this.get('time') + elapsed);
      }
    },

    start: function () {
      this.set('lastStarted', (new Date()).getTime());
    }
  });

  return function (config) {
    return new Game(config);
  };
});
