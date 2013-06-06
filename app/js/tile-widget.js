/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(function () {
  'use strict';

  // the UI part of a tile, used to manipulate it in tandem
  // with a BoardWidget
  var TileWidget = function (elt) {
    this.elt = elt;
  };

  TileWidget.prototype.height = function () {
    return this.elt.offsetHeight;
  };

  TileWidget.prototype.width = function () {
    return this.elt.offsetWidth;
  };

  TileWidget.prototype.x = function () {
    if (arguments.length) {
      this.elt.style.left = arguments[0] + 'px';
    }
    else {
      return this.elt.offsetLeft;
    }
  };

  TileWidget.prototype.y = function () {
    if (arguments.length) {
      this.elt.style.top = arguments[0] + 'px';
    }
    else {
      return this.elt.offsetTop;
    }
  };

  return TileWidget;
});
