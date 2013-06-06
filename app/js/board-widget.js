/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['hammer', 'rye'], function (Hammer, $) {
  'use strict';

  // clamp between minValue and maxValue
  var clamp = function (value, minValue, maxValue) {
    if (value < minValue) {
      value = minValue;
    }
    else if (value > maxValue) {
      value = maxValue;
    }

    return value;
  };

  var addTileHandler = function (tile, board) {
    var lastDeltaX;
    var lastDeltaY;

    // tile position when drag started
    var startX;
    var startY;

    var reset = function () {
      // can't start dragging a tile if board is disabled
      if (board.disabled) {
        return;
      }

      lastDeltaX = 0;
      lastDeltaY = 0;
      startX = tile.x();
      startY = tile.y();
    };

    Hammer(tile.elt)
    .on('dragstart', reset)
    .on('drag', function (e) {
      if (e.gesture) {
        e.gesture.preventDefault();

        board.applyDelta(
          tile,
          e.gesture.deltaX - lastDeltaX,
          e.gesture.deltaY - lastDeltaY
        );

        lastDeltaX = e.gesture.deltaX;
        lastDeltaY = e.gesture.deltaY;
      }
    })
    .on('dragend', function () {
      board.snap();
      board.game.incrementMoves();
      board.game.checkCompleted();
    });
  };

  // tiles: an array of Tile objects with structure
  // {tile: <TileWidget>, row: <int>, column: <int>, targetRow: <int>,
  // targetColumn: <int>}
  var Board = function () {
    this.tiles = [];
  };

  Board.prototype.reset = function (game, tileWidth, tileHeight) {
    this.game = game;

    this.completed = false;
    this.disabled = false;

    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.rows = game.get('rows');
    this.columns = game.get('columns');

    this.teardownTiles();
    this.tiles = game.get('tiles');
    this.setupTiles(game.get('photo').full);
  };

  // get the column,row position of a tile
  Board.prototype.getPosition = function (tile) {
    for (var i = 0; i < this.tiles.length; i += 1) {
      if (this.tiles[i].tile === tile) {
        return this.tiles[i];
      }
    }

    return null;
  };

  Board.prototype.teardownTiles = function () {
    for (var i = 0; i < this.tiles.length; i += 1) {
      Hammer(this.tiles[i].tile.elt).off('dragstart')
                                    .off('drag')
                                    .off('dragend');
    }
  };

  Board.prototype.setupTiles = function (photoUrl) {
    var board = this;
    var frameWidth = this.columns * this.tileWidth;
    var frameHeight = this.rows * this.tileHeight;

    var backgroundImage = 'url(' + photoUrl + ')';
    var backgroundSize = frameWidth + 'px ' + frameHeight + 'px';

    var styles = {
      'background-image': backgroundImage,
      'background-size': backgroundSize,
      'height': this.tileHeight + 'px',
      'width': this.tileWidth + 'px',
      'position': 'absolute'
    };

    var tileMeta;
    var column;
    var row;
    var targetColumn;
    var targetRow;
    var leftOffset;
    var topOffset;
    var leftImageOffset;
    var topImageOffset;

    for (var i = 0; i < this.tiles.length; i++) {
      tileMeta = this.tiles[i];

      column = tileMeta.column;
      row = tileMeta.row;
      targetColumn = tileMeta.targetColumn;
      targetRow = tileMeta.targetRow;

      leftOffset = (column - 1) * this.tileWidth;
      topOffset = (row - 1) * this.tileHeight;

      leftImageOffset = (targetColumn - 1) * this.tileWidth;
      topImageOffset = (targetRow - 1) * this.tileHeight;

      var backgroundPosition = '-' + leftImageOffset + 'px' +
                               ' ' +
                               '-' + topImageOffset + 'px';

      styles['background-position'] = backgroundPosition;
      styles.left = leftOffset + 'px';
      styles.top = topOffset + 'px';
      $(tileMeta.tile.elt).css(styles);

      addTileHandler(tileMeta.tile, board);
    }
  };

  // get the tile at a particular position
  Board.prototype.getTileAtPosition = function (column, row) {
    for (var i = 0; i < this.tiles.length; i += 1) {
      if (this.tiles[i].row === row && this.tiles[i].column === column) {
        return this.tiles[i];
      }
    }

    return 'empty';
  };

  // column: column to start from in the row
  Board.prototype.getTilesOnRow = function (column, row, direction) {
    var tiles = [];
    var nextTile;

    column += direction;
    for (column; column >= 1 && column <= this.columns; column += direction) {
      nextTile = this.getTileAtPosition(column, row);
      tiles.push(nextTile);
      if (nextTile === 'empty') {
        break;
      }
    }

    return tiles;
  };

  // row: row to start from in the column
  Board.prototype.getTilesInColumn = function (column, row, direction) {
    var tiles = [];
    var nextTile;

    row += direction;
    for (row; row >= 1 && row <= this.rows; row += direction) {
      nextTile = this.getTileAtPosition(column, row);
      tiles.push(nextTile);
      if (nextTile === 'empty') {
        break;
      }
    }

    return tiles;
  };

  // get the tiles between a tilePosition, up to and including the
  // empty "tile", in direction (-1 == left or up,
  // 1 == right or down) along the axis of movement moveAxis ('vertical' or
  // 'horizontal')
  Board.prototype.getTilesAlongAxis = function (tilePosition, moveAxis, direction) {
    var row = tilePosition.row;
    var column = tilePosition.column;

    var tiles = [];

    if (moveAxis === 'horizontal') {
      tiles = this.getTilesOnRow(column, row, direction);
    }
    else {
      tiles = this.getTilesInColumn(column, row, direction);
    }

    return tiles;
  };

  // move a single tile
  // tilePosition is an object
  // {tile: <Tile instance>, row: <tile row>, column: <tile column>, ...}
  Board.prototype.moveTile = function (tilePosition, deltaX, deltaY) {
    var tile = tilePosition.tile;

    var minX;
    var maxX;
    var minY;
    var maxY;

    var tileX = tile.x();
    var tileY = tile.y();

    var newX;
    var newY;

    // calculate the boundaries of the move to enable the tile's
    // row/column to be recalculated if it moves far enough
    if (deltaY === 0) {
      // moving left/right
      minX = Math.max(0, (tilePosition.column - 2) * this.tileWidth);
      maxX = Math.min(
        this.tileWidth * this.columns,
        this.tileWidth * (tilePosition.column)
      );
      newX = clamp(tileX + deltaX, minX, maxX);

      newY = tileY;
    }
    else {
      // moving up/down
      minY = Math.max(0, (tilePosition.row - 2) * this.tileHeight);
      maxY = Math.min(
        this.tileHeight * this.rows,
        this.tileHeight * (tilePosition.row)
      );
      newY = clamp(tileY + deltaY, minY, maxY);

      newX = tileX;
    }

    tile.x(newX);
    tile.y(newY);

    // reset row/column if tile reached bounds of the current move
    if (newX === maxX || newX === minX) {
      tilePosition.column = 1 + Math.floor(newX / this.tileWidth);
    }
    else if (newY === maxY || newY === minY) {
      tilePosition.row = 1 + Math.floor(newY / this.tileHeight);
    }
  };

  // apply a delta on a tile and to all tiles along
  // the axis of movement
  Board.prototype.applyDelta = function (tile, deltaX, deltaY) {
    var moveAxis = 'horizontal';
    var direction;

    // determine the main movement axis, and dampen movement along
    // the other axis
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      moveAxis = 'vertical';
      direction = (deltaY < 0 ? -1 : 1);
      deltaY = parseInt(deltaY, 10);
      deltaX = 0;
    }
    else {
      direction = (deltaX < 0 ? -1 : 1);
      deltaX = parseInt(deltaX, 10);
      deltaY = 0;
    }

    // get the position of the tile which the delta is to be applied to
    var tilePosition = this.getPosition(tile);

    // get any tiles between this position and the edge of the board,
    // on the axis of and in the direction of the delta,
    // stopping on reaching the empty tile; if there's no empty tile
    // before the edge of the board, we can't move this tile
    var tiles = this.getTilesAlongAxis(tilePosition, moveAxis, direction);

    // no tiles along this axis in this direction, or no empty tile
    // at the end of the line
    if (tiles.length < 1 || tiles.pop() !== 'empty') {
      return;
    }

    // we can move the tile
    this.moveTile(tilePosition, deltaX, deltaY);

    // and other tiles along the axis of movement
    for (var i = tiles.length - 1; i >= 0; i -= 1) {
      this.moveTile(tiles[i], deltaX, deltaY);
    }
  };

  // align all tiles with the grid
  Board.prototype.snap = function () {
    var tileX;
    var tileY;
    var closestColumn;
    var closestColumnX;
    var closestRow;
    var closestRowY;

    for (var i = 0; i < this.tiles.length; i += 1) {
      var tile = this.tiles[i].tile;

      // find closest column
      tileX = tile.x();
      closestColumn = 1 + Math.round(tileX / this.tileWidth);
      closestColumnX = (closestColumn - 1) * this.tileWidth;

      // find closest row
      tileY = tile.y();
      closestRow = 1 + Math.round(tileY / this.tileHeight);
      closestRowY = (closestRow - 1) * this.tileHeight;

      // apply deltas
      if (tileX !== closestColumnX || tileY !== closestRowY) {
        tile.x(closestColumnX);
        tile.y(closestRowY);

        // set column/row for tile as x or y changed
        this.tiles[i].column = closestColumn;
        this.tiles[i].row = closestRow;
      }
    }
  };

  return Board;
});
