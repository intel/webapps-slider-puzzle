/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['sound'], function (Sound) {
  'use strict';

  // files is a map from a sound alias to a file
  var SoundBoard = function (files) {
    this.files = files;
    this.sounds = {};
  };

  SoundBoard.prototype.load = function (name) {
    if (!this.sounds[name]) {
      this.sounds[name] = new Sound(this.files[name]);
    }
    return this.sounds[name];
  };

  SoundBoard.prototype.play = function (name) {
    var sound = this.load(name);

    if (!sound.ready) {
      sound.on('ready', function () {
        sound.play();
        sound.off('ready');
      });
    }
    else {
      sound.play();
    }
  };

  return SoundBoard;
});
